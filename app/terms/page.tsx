import React from "react";
import { PageTransition } from "@/components/page-transition";

export const metadata = {
  title: "Terms of Service - Magic Room",
  description: "Magic Room terms of service and user agreement",
};

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Last Updated: December 2024
            </h2>
            <p>
              These Terms of Service ("Terms") govern your use of Magic Room
              ("Service"). By accessing or using Magic Room, you agree to be
              bound by these Terms. If you do not agree to all of these Terms,
              please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              1. Service Description
            </h2>
            <p>
              Magic Room is an AI-powered interior design tool that transforms
              room photos into design variations using advanced artificial
              intelligence. Users upload photos and provide design preferences,
              and the Service generates multiple design variations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              2. User Eligibility
            </h2>
            <p>
              You must be at least 18 years old to use this Service. By using
              Magic Room, you represent and warrant that you meet all
              eligibility requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              3. Account & Use
            </h2>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              3.1 Account Creation
            </h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to provide accurate and complete
              information during registration.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              3.2 Acceptable Use
            </h3>
            <p>You agree not to:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Harass, threaten, or harm individuals</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Scrape, crawl, or automate access without permission</li>
              <li>
                Use the Service for commercial purposes without authorization
              </li>
              <li>
                Upload content that is illegal, explicit, or violates others'
                rights
              </li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              3.3 Prohibited Content
            </h3>
            <p>
              You may not upload images containing minors without parental
              consent, images of others without permission, or any content that
              violates laws or rights of others. We reserve the right to refuse
              service to users who violate these restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              4. Credits & Payments
            </h2>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.1 Credit System
            </h3>
            <p>
              Our Service operates on a credit-based system. Each design
              generation costs 1 credit. Credits are purchased separately and do
              not expire. Unused credits remain in your account indefinitely.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.2 Payment Terms
            </h3>
            <ul className="list-inside list-disc space-y-2">
              <li>Payments are processed through Stripe</li>
              <li>Prices are displayed in USD and include applicable taxes</li>
              <li>
                Credit purchases are non-refundable except where required by law
              </li>
              <li>Unused credits carry no monetary value</li>
              <li>
                Charges appear on your statement immediately after purchase
              </li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.3 Refunds
            </h3>
            <p>
              We offer a 7-day money-back guarantee for initial credit
              purchases. Refund requests must be made within 7 days of purchase.
              To request a refund, contact{" "}
              <a
                href="mailto:support@magicroom.app"
                className="text-purple-600 dark:text-purple-400"
              >
                support@magicroom.app
              </a>{" "}
              with your order details.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              4.4 Failed Generations
            </h3>
            <p>
              If a design generation fails, we will automatically refund the
              credit to your account within 30 minutes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              5. Intellectual Property
            </h2>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              5.1 Your Content
            </h3>
            <p>
              You retain all rights to images you upload. By uploading images to
              Magic Room, you grant us a limited license to process them for
              design generation. You confirm you own or have the right to share
              uploaded images.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              5.2 Generated Designs
            </h3>
            <p>
              Generated designs are created by combining your input with AI
              models. You may download and use generated designs for personal or
              commercial purposes, but may not claim exclusive ownership without
              proper licensing.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              5.3 Our Content
            </h3>
            <p>
              All Magic Room branding, interface design, and documentation are
              our property. You may not copy, modify, or distribute them without
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              6. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAGIC ROOM IS PROVIDED "AS
              IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
            <p className="mt-4">IN NO EVENT SHALL WE BE LIABLE FOR:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>Loss of revenue or profits</li>
              <li>Loss of data or business interruption</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>
                Any damages exceeding the amount you paid us in the past 6
                months
              </li>
            </ul>
            <p className="mt-4">
              This limitation applies even if we have been advised of the
              possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              7. Disclaimer of Warranties
            </h2>
            <p>
              We do not warrant that the Service will be uninterrupted,
              error-free, or meet your expectations. AI-generated designs may
              contain imperfections, inconsistencies, or may not match
              real-world construction standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              8. Rate Limiting & Abuse Prevention
            </h2>
            <p>
              We enforce rate limits to prevent abuse and ensure service
              availability. Free users are limited to 5 generations per hour.
              Paid users receive higher limits. Attempting to circumvent rate
              limits may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              9. Suspension & Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account if you:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or abusive behavior</li>
              <li>Upload illegal or infringing content</li>
              <li>Attempt to breach our systems</li>
            </ul>
            <p className="mt-4">
              Suspension may result in loss of credits and account data. We will
              make reasonable efforts to notify you of suspension before it
              takes effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              10. Third-Party Services
            </h2>
            <p>
              We use third-party services (Clerk, Supabase, Replicate, Stripe,
              Upstash) to provide this Service. We are not responsible for their
              actions, policies, or failures. Your use of these services is
              governed by their respective terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              11. Changes to Terms
            </h2>
            <p>
              We may modify these Terms at any time. We will notify you of
              material changes via email or prominent notice. Your continued use
              constitutes acceptance of updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              12. Dispute Resolution
            </h2>
            <p>
              Any disputes arising from these Terms or use of the Service shall
              be resolved through binding arbitration in accordance with the
              American Arbitration Association rules. You agree to waive your
              right to a jury trial and class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              13. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the United States, without
              regard to conflicts of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              14. Contact Information
            </h2>
            <p>Questions about these Terms? Contact us at:</p>
            <div className="mt-4 space-y-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
              <p>
                <strong>Magic Room Legal Team</strong>
              </p>
              <p>Email: legal@magicroom.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              15. Entire Agreement
            </h2>
            <p>
              These Terms, along with our Privacy Policy, constitute the entire
              agreement between you and Magic Room regarding the Service. If any
              provision is found invalid, the remaining provisions shall remain
              in effect.
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

