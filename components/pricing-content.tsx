"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/page-transition";
import { motion } from "framer-motion";

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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
        <PageTransition>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Magic Room Pricing
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Magic Room costs €9.99 for 30 designs, €19.99 for 90 designs, or €29.99 for 200
                        designs — all one-time payments, never a subscription. That works out to €0.33,
                        €0.22, and €0.15 per design. Credits never expire, and every new account gets 1
                        free design with no card required.
                    </p>
                </div>

                <motion.div
                    className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    {CREDIT_PACKAGES.map((pkg) => (
                        <motion.div key={pkg.id} variants={cardVariants}>
                            <Card
                                className={`relative h-full flex flex-col ${pkg.popular
                                        ? "border-primary shadow-lg ring-1 ring-primary"
                                        : "border-border"
                                    }`}
                            >
                                {pkg.popular && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                                        Most popular
                                    </Badge>
                                )}
                                <CardHeader className="pb-4">
                                    <h3 className="text-xl font-semibold">{pkg.name}</h3>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">
                                            {pkg.priceDisplay}
                                        </span>
                                        {!pkg.free && (
                                            <span className="text-muted-foreground"> one-time</span>
                                        )}
                                        {pkg.free && (
                                            <span className="text-muted-foreground"> forever</span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {pkg.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <ul className="space-y-3">
                                        {pkg.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    {pkg.free ? (
                                        clerkUser ? (
                                            <Button
                                                variant="outline"
                                                className="w-full bg-transparent cursor-pointer"
                                                onClick={() => router.push("/generate")}
                                            >
                                                Go to generate
                                            </Button>
                                        ) : (
                                            <SignUpButton mode="modal">
                                                <Button
                                                    variant="outline"
                                                    size="default"
                                                    className="w-full bg-transparent cursor-pointer"
                                                >
                                                    Get started free
                                                </Button>
                                            </SignUpButton>
                                        )
                                    ) : clerkUser ? (
                                        <Button
                                            className={`w-full cursor-pointer ${pkg.popular ? "bg-primary hover:bg-primary/90" : ""
                                                }`}
                                            variant={pkg.popular ? "default" : "outline"}
                                            onClick={() => handlePurchase(pkg.id)}
                                            disabled={loading === pkg.id}
                                        >
                                            {loading === pkg.id
                                                ? "Loading..."
                                                : `Purchase ${pkg.name}`}
                                        </Button>
                                    ) : (
                                        <SignUpButton mode="modal">
                                            <Button
                                                variant={pkg.popular ? "default" : "outline"}
                                                size="default"
                                                className={`w-full cursor-pointer ${pkg.popular ? "bg-primary hover:bg-primary/90" : ""
                                                    }`}
                                            >
                                                {isLoaded ? "Sign up to purchase" : "Loading..."}
                                            </Button>
                                        </SignUpButton>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <section className="mx-auto mt-20 max-w-3xl">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        What does one credit get you?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        One credit is one generation session, not one image. A single Standard-quality
                        credit returns 4–8 different redesigns of the same room in 30–60 seconds, so €0.33
                        buys a set of variations to compare rather than a single picture.
                    </p>
                    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-4 py-3 text-left font-semibold">Pack</th>
                                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                                    <th className="px-4 py-3 text-left font-semibold">Designs</th>
                                    <th className="px-4 py-3 text-left font-semibold">Cost per design</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="px-4 py-3 font-medium">Free</td>
                                    <td className="px-4 py-3">€0</td>
                                    <td className="px-4 py-3">1</td>
                                    <td className="px-4 py-3">€0</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="px-4 py-3 font-medium">Starter</td>
                                    <td className="px-4 py-3">€9.99 one-time</td>
                                    <td className="px-4 py-3">30</td>
                                    <td className="px-4 py-3">€0.33</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="px-4 py-3 font-medium">Growth</td>
                                    <td className="px-4 py-3">€19.99 one-time</td>
                                    <td className="px-4 py-3">90</td>
                                    <td className="px-4 py-3">€0.22</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Premium</td>
                                    <td className="px-4 py-3">€29.99 one-time</td>
                                    <td className="px-4 py-3">200</td>
                                    <td className="px-4 py-3">€0.15</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mx-auto mt-16 max-w-3xl">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        How does Magic Room pricing compare to other AI interior design tools?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Magic Room is the only widely used AI room redesign tool that sells non-expiring
                        one-time credits. RoomGPT, Interior AI, Reimagine Home, and DecorAI all require a
                        subscription for full access, and Reimagine Home resets unused credits every month.
                        Traditional virtual staging services charge €75–150 per room with a 24–72 hour
                        turnaround, against €0.15–€0.33 and under a minute here.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Competitor plans change often — check each vendor&apos;s own pricing page for their
                        current figures.
                    </p>
                </section>

                <section className="mx-auto mt-16 max-w-3xl">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Pricing questions
                    </h2>

                    <h3 className="mt-8 text-lg font-semibold">Do Magic Room credits expire?</h3>
                    <p className="mt-2 text-muted-foreground">
                        No. Credits are stored as a balance on your account and only decrease when you run a
                        generation. There is no monthly reset and no expiry date, so a pack bought today is
                        still usable a year from now.
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">Is there a free version of Magic Room?</h3>
                    <p className="mt-2 text-muted-foreground">
                        Yes. Every new account gets 1 free credit on signup with no payment card required.
                        That credit produces a full generation of 4–8 design variations. Free-credit output
                        is for personal use only and carries no commercial rights.
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">Is there a subscription?</h3>
                    <p className="mt-2 text-muted-foreground">
                        No. Magic Room has no subscription of any kind — checkout creates a one-time payment,
                        so there is no recurring charge and nothing to cancel. You buy credits when you need
                        them and they stay on your account.
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">
                        Can you use the designs commercially?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Yes, on paid credits. Every design generated with a purchased credit carries full
                        commercial rights — real estate listing photos, client presentations, Airbnb listing
                        imagery, and renovation decks are all permitted.
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">
                        What happens to your photo when you generate a design?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Nothing is kept. Your room photo is processed in memory for the length of the request
                        and then discarded — it is never written to a storage bucket, never saved to a
                        database, and never used to train an AI model.
                    </p>

                    <h3 className="mt-8 text-lg font-semibold">
                        What if a generation fails?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        The credit is refunded automatically. If the AI call errors or times out, the credit
                        goes straight back onto your balance rather than being consumed.
                    </p>
                </section>
            </div>
        </PageTransition>
    );
}
