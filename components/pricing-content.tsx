"use client";

import React, { Suspense, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckoutReturnNotice } from "@/components/checkout-return-notice";
import { cn } from "@/lib/utils";

const CREDIT_PACKAGES = [
  {
    id: "free",
    name: "Free",
    credits: 1,
    price: 0,
    priceDisplay: "€0",
    priceId: null,
    description: "Perfect for trying out",
    features: [
      "1 free design included",
      "High-quality results",
      "All design themes",
      "No credit card required",
    ],
    popular: false,
    free: true,
  },
  {
    id: "starter",
    name: "Starter",
    credits: 30,
    price: 9.99,
    priceDisplay: "€9.99",
    description: "Best for occasional use",
    features: [
      "30 design generations",
      "Credits never expire",
      "Full resolution images",
      "All design themes",
    ],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    credits: 90,
    price: 19.99,
    priceDisplay: "€19.99",
    description: "Best for regular users",
    features: [
      "90 design generations",
      "Credits never expire",
      "Priority support",
      "All design themes",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 200,
    price: 29.99,
    priceDisplay: "€29.99",
    description: "Best for professionals",
    features: [
      "200 design generations",
      "Credits never expire",
      "24/7 priority support",
      "Early access to new features",
    ],
    popular: false,
  },
];

const COST_ROWS = [
  { pack: "Free", price: "€0", designs: "1", perDesign: "€0" },
  { pack: "Starter", price: "€9.99 one-time", designs: "30", perDesign: "€0.33" },
  { pack: "Growth", price: "€19.99 one-time", designs: "90", perDesign: "€0.22" },
  { pack: "Premium", price: "€29.99 one-time", designs: "200", perDesign: "€0.15" },
];

const FAQS = [
  {
    q: "Do Magic Room credits expire?",
    a: "No. Credits are stored as a balance on your account and only decrease when you run a generation. There is no monthly reset and no expiry date, so a pack bought today is still usable a year from now.",
  },
  {
    q: "Is there a free version of Magic Room?",
    a: "Yes. Every new account gets 1 free credit on signup with no payment card required. That credit produces a full generation of 4–8 design variations. Free-credit output is for personal use only and carries no commercial rights.",
  },
  {
    q: "Is there a subscription?",
    a: "No. Magic Room has no subscription of any kind — checkout creates a one-time payment, so there is no recurring charge and nothing to cancel. You buy credits when you need them and they stay on your account.",
  },
  {
    q: "Can you use the designs commercially?",
    a: "Yes, on paid credits. Every design generated with a purchased credit carries full commercial rights — real estate listing photos, client presentations, Airbnb listing imagery, and renovation decks are all permitted.",
  },
  {
    q: "What happens to your photo when you generate a design?",
    a: "Nothing is kept. Your room photo is processed in memory for the length of the request and then discarded — it is never written to a storage bucket, never saved to a database, and never used to train an AI model.",
  },
  {
    q: "What if a generation fails?",
    a: "The credit is refunded automatically. If the AI call errors or times out, the credit goes straight back onto your balance rather than being consumed.",
  },
];

const H2 =
  "font-serif text-[clamp(34px,4.4vw,56px)] font-normal leading-[1.02] tracking-[-0.022em] text-balance";

export default function PricingContent() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!clerkUser) return;

    setLoading(packageId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate purchase. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pb-24 md:pb-32">
      <section className="container-page pt-10 sm:pt-14 md:pt-20">
        <Suspense fallback={null}>
          <CheckoutReturnNotice />
        </Suspense>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1 className="font-serif text-[clamp(52px,8vw,112px)] font-normal leading-[0.92] tracking-[-0.03em] lg:col-span-6">
            Magic Room Pricing
          </h1>
          <p className="max-w-[38rem] text-[16px] leading-[1.6] text-ink-2 sm:text-[17px] lg:col-span-6 lg:pb-2">
            Magic Room costs €9.99 for 30 designs, €19.99 for 90 designs, or €29.99 for 200
            designs — all one-time payments, never a subscription. That works out to €0.33,
            €0.22, and €0.15 per design. Credits never expire, and every new account gets 1
            free design with no card required.
          </p>
        </div>

        <div
          className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-4"
        >
          {CREDIT_PACKAGES.map((pkg, i) => (
            <div
              key={pkg.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-6 sm:p-7",
                pkg.popular
                  ? "border-transparent bg-night text-cream"
                  : "border-line bg-paper-2 text-ink",
              )}
            >
              <div className="flex min-h-7 items-center justify-between gap-3">
                {/* Badge stays before the name in the markup (reading order), shown on the right. */}
                {pkg.popular && (
                  <span className="order-last inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-2.5 py-1 text-xs font-medium text-cream">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                    Most popular
                  </span>
                )}
                <h3 className="text-[15px] font-medium tracking-[-0.005em]">{pkg.name}</h3>
              </div>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-serif text-[64px] leading-[0.9] tracking-[-0.03em] tabular-nums">
                  {pkg.priceDisplay}
                </span>
                {!pkg.free && (
                  <span className={pkg.popular ? "text-cream-2" : "text-ink-3"}> one-time</span>
                )}
                {pkg.free && (
                  <span className={pkg.popular ? "text-cream-2" : "text-ink-3"}> forever</span>
                )}
              </div>
              <p className={cn("mt-3 text-sm", pkg.popular ? "text-cream-2" : "text-ink-2")}>
                {pkg.description}
              </p>

              <ul
                className={cn(
                  "mt-6 space-y-3 border-t pt-6",
                  pkg.popular ? "border-cream/15" : "border-line",
                )}
              >
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[14.5px] leading-snug">
                    <Check
                      aria-hidden
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        pkg.popular ? "text-cream-2" : "text-ink-3",
                      )}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                {pkg.free ? (
                  clerkUser ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/generate")}
                    >
                      Go to generate
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Get started free
                      </Button>
                    </SignUpButton>
                  )
                ) : clerkUser ? (
                  <Button
                    variant={pkg.popular ? "cream" : "default"}
                    className="w-full"
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading === pkg.id}
                  >
                    {loading === pkg.id ? "Loading..." : `Purchase ${pkg.name}`}
                  </Button>
                ) : (
                  <SignUpButton mode="modal">
                    <Button variant={pkg.popular ? "cream" : "default"} className="w-full">
                      {isLoaded ? "Sign up to purchase" : "Loading..."}
                    </Button>
                  </SignUpButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-24 md:mt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className={H2}>What does one credit get you?</h2>
            <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.6] text-ink-2">
              One credit is one generation session, not one image. A single Standard-quality
              credit returns 4–8 different redesigns of the same room in 30–60 seconds, so €0.33
              buys a set of variations to compare rather than a single picture.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line lg:col-span-7 lg:self-end">
            <table className="w-full text-left text-[14px] sm:text-[14.5px]">
              <thead>
                <tr className="border-b border-line bg-paper-2 text-[11px] uppercase tracking-[0.14em] text-ink-3">
                  <th className="px-3 py-3.5 align-bottom font-medium sm:px-5">Pack</th>
                  <th className="px-3 py-3.5 align-bottom font-medium sm:px-5">Price</th>
                  <th className="px-3 py-3.5 align-bottom font-medium sm:px-5">Designs</th>
                  <th className="px-3 py-3.5 align-bottom font-medium sm:px-5">Cost per design</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {COST_ROWS.map((row) => (
                  <tr key={row.pack} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-4 font-medium sm:px-5">{row.pack}</td>
                    <td className="px-3 py-4 text-ink-2 sm:px-5">{row.price}</td>
                    <td className="px-3 py-4 text-ink-2 sm:px-5">{row.designs}</td>
                    <td className="px-3 py-4 font-serif text-[22px] leading-none sm:px-5">
                      {row.perDesign}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-24 rounded-3xl bg-night text-cream sm:mx-4 sm:rounded-4xl md:mt-36">
        <div className="container-page py-16 sm:py-20 md:py-28">
          <h2 className={cn(H2, "max-w-[18ch]")}>
            How does Magic Room pricing compare to other AI interior design tools?
          </h2>
          <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-12">
            <p className="text-[16px] leading-[1.65] text-cream-2 sm:text-[17px] md:col-span-7">
              Magic Room is the only widely used AI room redesign tool that sells non-expiring
              one-time credits. RoomGPT, Interior AI, Reimagine Home, and DecorAI all require a
              subscription for full access, and Reimagine Home resets unused credits every month.
              Traditional virtual staging services charge €75–150 per room with a 24–72 hour
              turnaround, against €0.15–€0.33 and under a minute here.
            </p>
            <p className="text-sm leading-[1.6] text-cream-2 md:col-span-4 md:col-start-9 md:self-end">
              Competitor plans change often — check each vendor&apos;s own pricing page for their
              current figures.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page mt-24 md:mt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className={cn(H2, "lg:sticky lg:top-28 lg:col-span-4 lg:self-start")}>
            Pricing questions
          </h2>
          <div className="border-t border-line lg:col-span-8">
            {FAQS.map((item) => (
              <div key={item.q} className="border-b border-line py-7 md:py-8">
                <h3 className="font-serif text-[24px] font-normal leading-[1.15] tracking-[-0.015em] md:text-[28px]">
                  {item.q}
                </h3>
                <p className="mt-3 max-w-[40rem] text-[15.5px] leading-[1.65] text-ink-2">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
