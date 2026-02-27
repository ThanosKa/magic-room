"use client";

import React from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export function Footer() {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-bold dark:text-white">
                Magic Room
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Transform your space with AI-powered interior design.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-100">
              Product
            </h3>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isSignedIn) {
                      openSignIn();
                    } else {
                      window.location.href = "/generate";
                    }
                  }}
                  className="cursor-pointer text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Generate
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-100">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-100">
              Design Ideas
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/design"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  All design styles
                </Link>
              </li>
              <li>
                <Link
                  href="/design/modern-living-room"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Modern living room
                </Link>
              </li>
              <li>
                <Link
                  href="/design/scandinavian-bedroom"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Scandinavian bedroom
                </Link>
              </li>
              <li>
                <Link
                  href="/design/industrial-kitchen"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Industrial kitchen
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-100">
              Compare
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/alternatives"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  All alternatives
                </Link>
              </li>
              <li>
                <Link
                  href="/alternatives/roomgpt"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  RoomGPT alternative
                </Link>
              </li>
              <li>
                <Link
                  href="/alternatives/decorai"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  DecorAI alternative
                </Link>
              </li>
              <li>
                <Link
                  href="/vs/roomgpt"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Magic Room vs RoomGPT
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-100">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="https://github.com/ThanosKa/magic-room"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/KazakisThanos"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Twitter / X
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:kazakis.th@gmail.com"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; 2026 Thaka — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
