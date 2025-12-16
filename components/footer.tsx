"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-lg font-bold dark:text-white">
                Magic Room
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Bring your old photos back to life with AI-powered restoration.
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
                <Link
                  href="/generate"
                  className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  Generate
                </Link>
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
            &copy; 2025 Thaka — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
