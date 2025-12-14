"use client";

import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { user: clerkUser } = useUser();
  const { credits } = useUserStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-200 bg-white/80 backdrop-blur dark:border-purple-900 dark:bg-slate-950/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700" />
          <span className="font-bold text-lg dark:text-white">Magic Room</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400"
          >
            Home
          </Link>
          {clerkUser && (
            <>
              <Link
                href="/generate"
                className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400"
              >
                Generate
              </Link>
              <Link
                href="/purchase"
                className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400"
              >
                Buy Credits
              </Link>
            </>
          )}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Credits Badge */}
          {clerkUser && credits > 0 && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
            >
              {credits} Credits
            </Badge>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Auth */}
          {clerkUser ? (
            <UserButton />
          ) : (
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
