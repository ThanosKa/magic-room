"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Menu, Coins } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditsSkeleton } from "@/components/ui/loading-states";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Logo } from "@/components/logo";

export function Header() {
  const { user: clerkUser } = useUser();
  const { credits, isLoading } = useUserStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const isMounted = typeof window !== "undefined";

  return (
    <>
      <AnnouncementBanner />
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-lg">Magic Room</span>
          </Link>

          <nav className="hidden gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/generate"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              Generate
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {clerkUser && (
              <div className="hidden sm:flex">
                {isLoading ? (
                  <CreditsSkeleton />
                ) : (
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/20"
                  >
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-primary">{credits} credits</span>
                  </Link>
                )}
              </div>
            )}

            {clerkUser ? (
              <div className="hidden md:flex">
                <UserButton />
              </div>
            ) : (
              <div className="hidden gap-2 md:flex">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              {isMounted && (
                <SheetContent side="right" className="w-80 max-w-[90vw] px-4">
                  <div className="flex flex-col gap-6 pt-6">
                    {clerkUser && (
                      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 dark:bg-primary/20">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {credits} credits
                        </span>
                      </div>
                    )}

                    <nav className="flex flex-col gap-3">
                      <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-2 py-1.5 text-lg font-medium transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                      >
                        Home
                      </Link>
                      <Link
                        href="/generate"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-2 py-1.5 text-lg font-medium transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                      >
                        Generate
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-2 py-1.5 text-lg font-medium transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                      >
                        Pricing
                      </Link>
                    </nav>

                    {clerkUser ? (
                      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                        <UserButton />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setMobileOpen(false)}
                          >
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            Sign Up
                          </Button>
                        </SignUpButton>
                      </div>
                  )}
                </div>
              </SheetContent>
              )}
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
