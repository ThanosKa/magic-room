"use client";

import React, { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/page-transition";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 30,
    price: 9.99,
    priceId: "price_starter_placeholder",
    description: "Perfect for trying out Magic Room",
    features: [
      "30 credits",
      "~30 design generations",
      "Full resolution images",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 150,
    price: 19.99,
    priceId: "price_pro_placeholder",
    description: "Best for most users",
    features: ["150 credits", "~150 design generations", "Priority support"],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Pack",
    credits: 300,
    price: 29.99,
    priceId: "price_ultimate_placeholder",
    description: "Unlimited creativity",
    features: [
      "300 credits",
      "~300 design generations",
      "24/7 priority support",
    ],
    popular: false,
  },
];

/**
 * Pricing page - buy credits
 */
export default function PricingPage() {
  const { user: clerkUser } = useUser();
  const { signIn } = useSignIn();
  const { credits, refreshUser } = useUserStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    // If not signed in, redirect to sign up
    if (!clerkUser) {
      const redirectUrl = window.location.origin + "/pricing";
      window.location.href = `/sign-up?redirect_url=${encodeURIComponent(
        redirectUrl
      )}`;
      return;
    }

    setIsProcessing(true);
    setSelectedPackage(packageId);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate purchase. Please try again.");
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Buy Credits
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Choose the perfect package for your design needs
          </p>

          {/* Current Credits Display */}
          {clerkUser && (
            <div className="mt-6 inline-block rounded-full bg-purple-100 px-4 py-2 dark:bg-purple-900/30">
              <p className="text-sm font-medium">
                Current balance:{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  {credits} credits
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative flex flex-col transition-all ${
                pkg.popular
                  ? "border-purple-500 shadow-lg ring-2 ring-purple-500/20 md:scale-105"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-3 py-1">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-4 p-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {pkg.description}
                  </p>
                </div>

                {/* Credits & Price */}
                <div className="space-y-2 border-y border-slate-200 py-4 dark:border-slate-700">
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {pkg.credits}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    credits
                  </p>
                  <div className="pt-2">
                    <p className="text-3xl font-bold">${pkg.price}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      ${(pkg.price / pkg.credits).toFixed(3)} per credit
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isProcessing && selectedPackage === pkg.id}
                  className={`w-full gap-2 ${
                    pkg.popular
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                  }`}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Questions?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                How long do credits last?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Credits never expire. Use them anytime you want to generate new
                designs.
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                What if I'm not happy?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We offer a 7-day money-back guarantee for all credit purchases.
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Yes, contact our support team within 7 days of purchase for a
                full refund.
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Is it secure?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Payments are processed securely through Stripe. We never see
                your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {clerkUser && (
          <div className="mt-12 text-center">
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Ready to create amazing designs?
            </p>
            <Button
              onClick={() => router.push("/generate")}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Start Creating →
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
