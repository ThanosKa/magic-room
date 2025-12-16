"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
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
import { Check, Loader2 } from "lucide-react";
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
            "1 design per day",
            "Resets every 24 hours",
            "High-quality results",
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
        credits: 150,
        price: 19.99,
        priceDisplay: "€19.99",
        description: "Best for regular users",
        features: [
            "150 design generations",
            "Credits never expire",
            "Priority support",
            "All design themes",
        ],
        popular: true,
    },
    {
        id: "premium",
        name: "Premium",
        credits: 300,
        price: 29.99,
        priceDisplay: "€29.99",
        description: "Best for professionals",
        features: [
            "300 design generations",
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
    const { credits } = useUserStore();
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
                        Simple, transparent pricing
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Choose the plan that works best for you. Credits never expire.
                    </p>
                </div>

                <motion.div
                    className="mt-16 grid gap-8 lg:grid-cols-4"
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
                                            <span className="text-muted-foreground">/day</span>
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
            </div>
        </PageTransition>
    );
}
