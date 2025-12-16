import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { privacyMetadata } from "@/lib/seo";

export const metadata: Metadata = privacyMetadata();

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Last Updated: December 2024
            </h2>
            <p>
              Magic Room ("we," "us," "our," or "Company") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              1.1 Information You Provide
            </h3>
            <ul className="list-inside list-disc space-y-2">
              <li>Email address (via Clerk authentication)</li>
              <li>Account preferences and settings</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>
                Room design preferences (room type, theme, custom prompts)
              </li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              1.2 Information Automatically Collected
            </h3>
            <ul className="list-inside list-disc space-y-2">
              <li>IP address and browser type</li>
              <li>Usage analytics (via Vercel Analytics)</li>
              <li>Device information and cookies</li>
              <li>Referrer and landing page information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process your payments and manage credits</li>
              <li>To authenticate your account via Clerk</li>
              <li>To generate design variations using Google Gemini AI via OpenRouter</li>
              <li>To improve our service quality and user experience</li>
              <li>To comply with legal obligations</li>
              <li>To send account notifications and support communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              3. Privacy-First Image Processing
            </h2>
            <p>
              <strong>
                Your images are processed ephemerally and never permanently
                stored:
              </strong>
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Upload Storage</strong>: Images stored in Supabase
                Storage are automatically deleted after 2 hours
              </li>
              <li>
                <strong>Processing</strong>: Images are sent directly to
                OpenRouter/Gemini AI for processing (in-memory only)
              </li>
              <li>
                <strong>Results</strong>: Generated designs are returned as
                base64 data (temporary, session-based)
              </li>
              <li>
                <strong>No Backup</strong>: We do not maintain backups of your
                uploaded images
              </li>
              <li>
                <strong>No Training</strong>: Your images are not used to train
                AI models
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              4. Third-Party Services
            </h2>
            <p>We share minimal data with trusted service providers:</p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.1 Clerk (Authentication)
            </h3>
            <p>
              We use Clerk for secure authentication. Clerk receives your email
              and authentication details. See{" "}
              <a
                href="https://clerk.com/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clerk's Privacy Policy
              </a>
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.2 Supabase (Database & Storage)
            </h3>
            <p>
              Your account data and temporarily uploaded images are stored in
              Supabase. See{" "}
              <a
                href="https://supabase.com/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase's Privacy Policy
              </a>
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.3 OpenRouter & Google (AI Processing)
            </h3>
            <p>
              Your room images are sent to OpenRouter, which routes them to
              Google's Gemini AI for processing. Images are processed in-memory
              and not stored. See{" "}
              <a
                href="https://openrouter.ai/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenRouter's Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google's Privacy Policy
              </a>
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.4 Stripe (Payments)
            </h3>
            <p>
              Payment information is processed securely through Stripe. We never
              see your card details. See{" "}
              <a
                href="https://stripe.com/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stripe's Privacy Policy
              </a>
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.5 Upstash (Rate Limiting)
            </h3>
            <p>
              We use Upstash Redis for rate limiting. Only request metadata is
              stored temporarily. See{" "}
              <a
                href="https://upstash.com/privacy"
                className="text-purple-600 underline dark:text-purple-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Upstash's Privacy Policy
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              5. Data Security
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>All data transmitted over encrypted HTTPS connections</li>
              <li>Supabase handles encryption at rest for stored data</li>
              <li>
                API keys and secrets are securely stored and never exposed
              </li>
              <li>We follow industry-standard security practices</li>
              <li>
                Images are automatically deleted to minimize security risk
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>Access your personal data</li>
              <li>Request corrections to inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in machine-readable format</li>
              <li>Opt-out of optional communications</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:kazakis.th@gmail.com"
                className="text-purple-600 dark:text-purple-400"
              >
                kazakis.th@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              7. GDPR Compliance
            </h2>
            <p>
              For users in the EU, we comply with GDPR requirements. We process
              personal data only with your consent and provide transparent
              information about data handling. You have the right to withdraw
              consent at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              8. Cookies
            </h2>
            <p>
              We use cookies to maintain your session and improve your
              experience. You can control cookie settings in your browser.
              Essential cookies cannot be disabled as they are necessary for the
              service to function.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of significant changes via email or a prominent notice on our
              site. Your continued use of the service constitutes acceptance of
              changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              10. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us at:
            </p>
            <div className="mt-4 space-y-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
              <p>
                <strong>Magic Room Privacy Team</strong>
              </p>
              <p>Email: kazakis.th@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

