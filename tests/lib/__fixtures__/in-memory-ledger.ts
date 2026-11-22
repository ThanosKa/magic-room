import type {
  addCredits,
  createTransaction,
  deductCreditsWithUsage,
  grantPurchaseCredits,
} from "@/lib/supabase";

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

type FailureMode = "returns-failure" | "throws";

function createInMemoryLedger() {
  const balances = new Map<string, number>();
  const rows: LedgerRow[] = [];
  const pendingFailures: { fn: FailingFunction; mode: FailureMode }[] = [];
  let usageRowsToRefuse = 0;

  function refusesUsageRow(): boolean {
    if (usageRowsToRefuse === 0) return false;
    usageRowsToRefuse -= 1;
    return true;
  }

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
    async deductCreditsWithUsage({ userId, amount }: Parameters<typeof deductCreditsWithUsage>[0]): Promise<boolean> {
      if (await roundTrip("deductCreditsWithUsage")) return false;
      const balance = balances.get(userId);
      if (balance === undefined || balance < amount) return false;
      if (refusesUsageRow()) return false;
      balances.set(userId, balance - amount);
      rows.push({ userId, type: "usage", amount });
      return true;
    },

    async addCredits({ userId, amount }: Parameters<typeof addCredits>[0]): Promise<boolean> {
      if (await roundTrip("addCredits")) return false;
      const balance = balances.get(userId);
      if (balance === undefined) return false;
      balances.set(userId, balance + amount);
      return true;
    },

    async createTransaction({
      userId,
      type,
      amount,
      stripePaymentId,
      metadata,
    }: Parameters<typeof createTransaction>[0]): Promise<LedgerRow | null> {
      if (await roundTrip("createTransaction")) return null;
      if (!balances.has(userId)) return null;
      if (type === "usage" && refusesUsageRow()) return null;
      const row: LedgerRow = { userId, type, amount, stripePaymentId, metadata };
      rows.push(row);
      return row;
    },

    async grantPurchaseCredits({
      userId,
      stripePaymentId,
      credits,
      metadata,
    }: Parameters<typeof grantPurchaseCredits>[0]): Promise<{ granted: boolean } | null> {
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

    reset(): void {
      balances.clear();
      rows.length = 0;
      pendingFailures.length = 0;
      usageRowsToRefuse = 0;
    },

    setBalance(userId: string, credits: number): void {
      balances.set(userId, credits);
    },

    balanceOf(userId: string): number | undefined {
      return balances.get(userId);
    },

    rowsOf(userId: string, type?: TransactionType): LedgerRow[] {
      return rows.filter((row) => row.userId === userId && (!type || row.type === type));
    },

    failNext(fn: FailingFunction, mode: FailureMode = "returns-failure"): void {
      pendingFailures.push({ fn, mode });
    },

    refuseNextUsageRow(): void {
      usageRowsToRefuse += 1;
    },
  };
}

export const inMemoryLedger = createInMemoryLedger();
