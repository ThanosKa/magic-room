// An in-memory stand-in for the Balance functions of `@/lib/supabase`, for tests
// of the credit ledger. Install it with vi.mock:
//
//   vi.mock("@/lib/supabase", async () => {
//     const { inMemoryLedger } = await import("./__fixtures__/in-memory-ledger");
//     return inMemoryLedger.supabaseFunctions;
//   });
//
// Each behaviour mirrors a rule of the real SQL, named in the comment beside it.
// If a migration changes one of those rules, change the line here too.

type TransactionType = "purchase" | "usage" | "bonus" | "refund";

export interface LedgerRow {
  userId: string;
  type: TransactionType;
  amount: number;
  stripePaymentId?: string;
  metadata?: Record<string, unknown>;
}

type FailingFunction =
  | "deductCreditsWithUsage"
  | "addCredits"
  | "createTransaction"
  | "grantPurchaseCredits";

// "returns-failure" is what the data module gives back when the database call
// errors (false or null). "throws" is an exception the data module never raises
// today, for proving the ledger survives one.
type FailureMode = "returns-failure" | "throws";

function createInMemoryLedger() {
  const balances = new Map<string, number>();
  const rows: LedgerRow[] = [];
  const pendingFailures: { fn: FailingFunction; mode: FailureMode }[] = [];
  let usageRowsToRefuse = 0;

  // Consumes one pending `usage` row refusal, if there is one.
  function refusesUsageRow(): boolean {
    if (usageRowsToRefuse === 0) return false;
    usageRowsToRefuse -= 1;
    return true;
  }

  // The real functions await a network round trip before the database runs the
  // statement. Yielding here lets two calls be in flight at once, so the
  // check-and-write that follows has to be atomic to pass the concurrency test.
  async function roundTrip(fn: FailingFunction): Promise<FailureMode | null> {
    await Promise.resolve();
    const index = pendingFailures.findIndex((failure) => failure.fn === fn);
    if (index === -1) return null;
    const [failure] = pendingFailures.splice(index, 1);
    if (failure.mode === "throws") {
      throw new Error(`In-memory ledger: ${fn} threw`);
    }
    return failure.mode;
  }

  const supabaseFunctions = {
    // deduct_credits_with_usage (006): `UPDATE users SET credits = credits -
    // p_amount WHERE id = p_user_id AND credits >= p_amount`, RETURN FALSE if
    // NOT FOUND, then INSERT the `usage` row (no payment id, no metadata), in one
    // transaction. The check and both writes happen together, with no await
    // between them. FALSE when the Balance is too low or the User does not
    // exist. A refused `usage` row raises, which rolls the subtraction back; the
    // data module turns the error into false.
    async deductCreditsWithUsage({ userId, amount }: { userId: string; amount: number }): Promise<boolean> {
      if (await roundTrip("deductCreditsWithUsage")) return false;
      const balance = balances.get(userId);
      if (balance === undefined || balance < amount) return false;
      if (refusesUsageRow()) return false;
      balances.set(userId, balance - amount);
      rows.push({ userId, type: "usage", amount });
      return true;
    },

    // add_credits (005): `UPDATE users SET credits = credits + p_amount WHERE
    // id = p_user_id; RETURN FOUND`. FALSE when the User does not exist.
    async addCredits({ userId, amount }: { userId: string; amount: number }): Promise<boolean> {
      if (await roundTrip("addCredits")) return false;
      const balance = balances.get(userId);
      if (balance === undefined) return false;
      balances.set(userId, balance + amount);
      return true;
    },

    // INSERT INTO transactions (001): `user_id REFERENCES users(id)`, so a row
    // for an unknown User is refused; the data module turns the error into null.
    async createTransaction({
      userId,
      type,
      amount,
      stripePaymentId,
      metadata,
    }: {
      userId: string;
      type: TransactionType;
      amount: number;
      stripePaymentId?: string;
      metadata?: Record<string, unknown>;
    }): Promise<LedgerRow | null> {
      if (await roundTrip("createTransaction")) return null;
      if (!balances.has(userId)) return null;
      if (type === "usage" && refusesUsageRow()) return null;
      const row: LedgerRow = { userId, type, amount, stripePaymentId, metadata };
      rows.push(row);
      return row;
    },

    // grant_purchase_credits (004): inserts the `purchase` row with `ON CONFLICT
    // (stripe_payment_id) WHERE type = 'purchase' DO NOTHING` and returns FALSE
    // when the payment was already granted; otherwise adds the credits and
    // returns TRUE, all in one transaction. An unknown User fails the foreign
    // key and rolls everything back; the data module turns the error into null.
    async grantPurchaseCredits({
      userId,
      stripePaymentId,
      credits,
      metadata,
    }: {
      userId: string;
      stripePaymentId: string;
      credits: number;
      metadata: Record<string, unknown>;
    }): Promise<{ granted: boolean } | null> {
      if (await roundTrip("grantPurchaseCredits")) return null;
      const balance = balances.get(userId);
      if (balance === undefined) return null;
      const alreadyGranted = rows.some(
        (row) => row.type === "purchase" && row.stripePaymentId === stripePaymentId
      );
      if (alreadyGranted) return { granted: false };
      rows.push({ userId, type: "purchase", amount: credits, stripePaymentId, metadata });
      balances.set(userId, balance + credits);
      return { granted: true };
    },
  };

  return {
    supabaseFunctions,

    /** Forgets every User, row and pending failure. Call in `beforeEach`. */
    reset(): void {
      balances.clear();
      rows.length = 0;
      pendingFailures.length = 0;
      usageRowsToRefuse = 0;
    },

    /** Creates the User if needed and sets the Balance. */
    setBalance(userId: string, credits: number): void {
      balances.set(userId, credits);
    },

    balanceOf(userId: string): number | undefined {
      return balances.get(userId);
    },

    rowsOf(userId: string, type?: TransactionType): LedgerRow[] {
      return rows.filter((row) => row.userId === userId && (!type || row.type === type));
    },

    /** Makes the next call to `fn` fail as the database would, or throw. */
    failNext(fn: FailingFunction, mode: FailureMode = "returns-failure"): void {
      pendingFailures.push({ fn, mode });
    },

    /**
     * Makes the database refuse the next `usage` row insert, as a failing
     * constraint or trigger would, whichever function writes it.
     */
    refuseNextUsageRow(): void {
      usageRowsToRefuse += 1;
    },
  };
}

export const inMemoryLedger = createInMemoryLedger();
