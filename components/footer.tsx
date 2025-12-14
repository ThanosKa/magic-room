import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700" />
              <span className="font-bold dark:text-white">Magic Room</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Privacy-first AI room redesign assistant
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold dark:text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/generate"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Generate
                </Link>
              </li>
              <li>
                <Link
                  href="/purchase"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold dark:text-white">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2025 Magic Room. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
