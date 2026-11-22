// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const MIGRATIONS_DIR = path.resolve(__dirname, "../../supabase/migrations");

const SUPABASE_STAND_INS = `
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN;
  CREATE SCHEMA auth;
  CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULL::uuid $$;
`;

let db: PGlite;

async function addUser(credits: number): Promise<string> {
    const result = await db.query<{ id: string }>(
        `INSERT INTO users (clerk_user_id, email, credits)
         VALUES ('clerk_' || gen_random_uuid(), 'user@example.com', $1) RETURNING id`,
        [credits],
    );
    return result.rows[0].id;
}

async function balanceOf(userId: string): Promise<number> {
    const result = await db.query<{ credits: number }>(
        "SELECT credits FROM users WHERE id = $1",
        [userId],
    );
    return result.rows[0].credits;
}

async function transactionsOf(userId: string) {
    const result = await db.query<{
        type: string;
        amount: number;
        stripe_payment_id: string | null;
        metadata: unknown;
    }>(
        "SELECT type, amount, stripe_payment_id, metadata FROM transactions WHERE user_id = $1",
        [userId],
    );
    return result.rows;
}

async function callBoolean(sql: string, params: unknown[]): Promise<boolean> {
    const result = await db.query<{ result: boolean }>(`SELECT ${sql} AS result`, params);
    return result.rows[0].result;
}

const UNKNOWN_USER = "00000000-0000-0000-0000-000000000000";

beforeAll(async () => {
    db = await PGlite.create({ extensions: { uuid_ossp, pgcrypto } });
    await db.exec(SUPABASE_STAND_INS);
    const files = readdirSync(MIGRATIONS_DIR)
        .filter((name) => name.endsWith(".sql"))
        .sort();
    for (const file of files) {
        await db.exec(readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
    }
}, 60_000);

afterAll(async () => {
    await db.close();
});

beforeEach(async () => {
    await db.exec("TRUNCATE users CASCADE");
});

describe("deduct_credits (005)", () => {
    it("takes the amount when the Balance covers it", async () => {
        const userId = await addUser(5);
        expect(await callBoolean("deduct_credits($1, $2)", [userId, 3])).toBe(true);
        expect(await balanceOf(userId)).toBe(2);
    });

    it("takes the whole Balance when the amount equals it", async () => {
        const userId = await addUser(3);
        expect(await callBoolean("deduct_credits($1, $2)", [userId, 3])).toBe(true);
        expect(await balanceOf(userId)).toBe(0);
    });

    it("returns false and leaves the Balance when it does not cover the amount", async () => {
        const userId = await addUser(2);
        expect(await callBoolean("deduct_credits($1, $2)", [userId, 3])).toBe(false);
        expect(await balanceOf(userId)).toBe(2);
    });

    it("returns false for an unknown User", async () => {
        expect(await callBoolean("deduct_credits($1, $2)", [UNKNOWN_USER, 1])).toBe(false);
    });
});

describe("add_credits (005)", () => {
    it("adds the amount and returns true", async () => {
        const userId = await addUser(2);
        expect(await callBoolean("add_credits($1, $2)", [userId, 4])).toBe(true);
        expect(await balanceOf(userId)).toBe(6);
    });

    it("returns false for an unknown User", async () => {
        expect(await callBoolean("add_credits($1, $2)", [UNKNOWN_USER, 4])).toBe(false);
    });
});

describe("grant_purchase_credits (004)", () => {
    it("adds the credits and writes one purchase row for the first grant", async () => {
        const userId = await addUser(1);
        const granted = await callBoolean(
            "grant_purchase_credits($1, $2, $3, $4::jsonb)",
            [userId, "pi_123", 10, JSON.stringify({ pack: "small" })],
        );
        expect(granted).toBe(true);
        expect(await balanceOf(userId)).toBe(11);
        expect(await transactionsOf(userId)).toEqual([
            { type: "purchase", amount: 10, stripe_payment_id: "pi_123", metadata: { pack: "small" } },
        ]);
    });

    it("adds nothing and reports already granted for the same payment id", async () => {
        const userId = await addUser(1);
        const args = [userId, "pi_123", 10, "{}"];
        await callBoolean("grant_purchase_credits($1, $2, $3, $4::jsonb)", args);
        const again = await callBoolean("grant_purchase_credits($1, $2, $3, $4::jsonb)", args);
        expect(again).toBe(false);
        expect(await balanceOf(userId)).toBe(11);
        expect(await transactionsOf(userId)).toHaveLength(1);
    });
});

describe("deduct_credits_with_usage (006)", () => {
    it("drops the Balance and writes exactly one usage row", async () => {
        const userId = await addUser(5);
        expect(await callBoolean("deduct_credits_with_usage($1, $2)", [userId, 3])).toBe(true);
        expect(await balanceOf(userId)).toBe(2);
        expect(await transactionsOf(userId)).toEqual([
            { type: "usage", amount: 3, stripe_payment_id: null, metadata: null },
        ]);
    });

    it("returns false and changes nothing when the Balance is too low", async () => {
        const userId = await addUser(2);
        expect(await callBoolean("deduct_credits_with_usage($1, $2)", [userId, 3])).toBe(false);
        expect(await balanceOf(userId)).toBe(2);
        expect(await transactionsOf(userId)).toEqual([]);
    });

    it("returns false and writes no row for an unknown User", async () => {
        expect(await callBoolean("deduct_credits_with_usage($1, $2)", [UNKNOWN_USER, 1])).toBe(false);
        const rows = await db.query("SELECT 1 FROM transactions");
        expect(rows.rows).toEqual([]);
    });

    it("changes nothing when the usage insert fails: both or neither", async () => {
        const userId = await addUser(5);
        await db.exec(`
          CREATE FUNCTION fail_usage_insert() RETURNS trigger LANGUAGE plpgsql AS $$
          BEGIN RAISE EXCEPTION 'usage insert refused'; END; $$;
          CREATE TRIGGER fail_usage_insert BEFORE INSERT ON transactions
            FOR EACH ROW EXECUTE FUNCTION fail_usage_insert();
        `);
        try {
            await expect(
                db.query("SELECT deduct_credits_with_usage($1, $2)", [userId, 3]),
            ).rejects.toThrow("usage insert refused");
        } finally {
            await db.exec("DROP TRIGGER fail_usage_insert ON transactions");
        }
        expect(await balanceOf(userId)).toBe(5);
        expect(await transactionsOf(userId)).toEqual([]);
    });
});

describe("execute rights", () => {
    const signatures = [
        "deduct_credits(uuid, integer)",
        "add_credits(uuid, integer)",
        "grant_purchase_credits(uuid, text, integer, jsonb)",
        "deduct_credits_with_usage(uuid, integer)",
    ];

    it.each(signatures)("%s runs for the service role only", async (signature) => {
        const can = async (role: string) =>
            (
                await db.query<{ ok: boolean }>(
                    "SELECT has_function_privilege($1, $2, 'EXECUTE') AS ok",
                    [role, signature],
                )
            ).rows[0].ok;
        expect(await can("service_role")).toBe(true);
        expect(await can("anon")).toBe(false);
        expect(await can("authenticated")).toBe(false);
        expect(await can("public")).toBe(false);
    });
});
