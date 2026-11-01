"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { readCheckoutReturn, waitForPurchasedCredits } from "@/lib/checkout-return";

/**
 * The message a buyer sees on /pricing after Stripe sends them back
 * (`?success=true` or `?success=false`, see app/api/checkout/route.ts).
 * Renders nothing on a plain visit. After a paid return it re-reads the
 * balance until the webhook has added the credits, so the header pill updates.
 * Must sit inside <Suspense> (it reads the query string).
 */
export function CheckoutReturnNotice() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(() => readCheckoutReturn(searchParams));
  const { user: clerkUser } = useUser();
  const refreshUser = useUserStore((s) => s.refreshUser);

  // Drop the query once read, so a reload or a shared link shows no message.
  useEffect(() => {
    if (status && window.location.search) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
  }, [status]);

  const clerkUserId = clerkUser?.id;
  useEffect(() => {
    if (status !== "success" || !clerkUserId) return;
    const leave = new AbortController();
    void waitForPurchasedCredits(
      async () => {
        await refreshUser(clerkUserId);
        return useUserStore.getState().credits;
      },
      { signal: leave.signal },
    );
    return () => leave.abort();
  }, [status, clerkUserId, refreshUser]);

  if (!status) return null;

  const paid = status === "success";

  return (
    <div
      role="status"
      className="mb-10 flex animate-rise items-start gap-4 rounded-xl border border-line bg-paper-2 p-5 sm:p-6 md:mb-14"
    >
      <span
        aria-hidden
        className={`mt-2 size-2 shrink-0 rounded-full ${paid ? "bg-accent" : "bg-ink-3"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="font-serif text-[26px] leading-[1.1] tracking-[-0.015em] sm:text-[30px]">
          {paid ? "Payment complete. Thank you." : "Payment cancelled."}
        </p>
        <p className="mt-2 max-w-[38rem] text-[15px] leading-[1.6] text-ink-2">
          {paid
            ? "Your credits are being added to your account and the balance in the header updates in a moment. Credits never expire."
            : "You have not been charged and nothing changed on your account. Pick a pack below whenever you are ready."}
        </p>
        {paid && (
          <Button asChild size="sm" className="mt-4">
            <Link href="/generate">Start designing</Link>
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2 -mt-2 shrink-0 text-ink-2"
        aria-label="Dismiss message"
        onClick={() => setStatus(null)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
