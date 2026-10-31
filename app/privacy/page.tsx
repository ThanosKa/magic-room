import React from "react";
import { Metadata } from "next";
import {
  LegalPage,
  legalContactClass,
  legalLeadClass,
} from "@/components/legal-page";
import { privacyMetadata } from "@/lib/seo";

export const metadata: Metadata = privacyMetadata();

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="Last Updated: December 2024">
      <section>
        <p className={legalLeadClass}>
          Magic Room (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; or
          &ldquo;Company&rdquo;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our website and services.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <h3>1.1 Information You Provide</h3>
        <ul>
          <li>Email address (via Clerk authentication)</li>
          <li>Account preferences and settings</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Room design preferences (room type, theme, custom prompts)</li>
        </ul>

        <h3>1.2 Information Automatically Collected</h3>
        <ul>
          <li>IP address and browser type</li>
          <li>Usage analytics (via Vercel Analytics)</li>
          <li>Device information and cookies</li>
          <li>Referrer and landing page information</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To process your payments and manage credits</li>
          <li>To authenticate your account via Clerk</li>
          <li>
            To generate design variations using Google Gemini AI via OpenRouter
          </li>
          <li>To improve our service quality and user experience</li>
          <li>To comply with legal obligations</li>
          <li>To send account notifications and support communications</li>
        </ul>
      </section>

      <section>
        <h2>3. Privacy-First Image Processing</h2>
        <p>
          <strong>
            Your images are processed ephemerally and never permanently stored:
          </strong>
        </p>
        <ul>
          <li>
            <strong>Upload Storage</strong>: Images stored in Supabase Storage
            are automatically deleted after 2 hours
          </li>
          <li>
            <strong>Processing</strong>: Images are sent directly to
            OpenRouter/Gemini AI for processing (in-memory only)
          </li>
          <li>
            <strong>Results</strong>: Generated designs are returned as base64
            data (temporary, session-based)
          </li>
          <li>
            <strong>No Backup</strong>: We do not maintain backups of your
            uploaded images
          </li>
          <li>
            <strong>No Training</strong>: Your images are not used to train AI
            models
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>We share minimal data with trusted service providers:</p>

        <h3>4.1 Clerk (Authentication)</h3>
        <p>
          We use Clerk for secure authentication. Clerk receives your email and
          authentication details. See{" "}
          <a
            href="https://clerk.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clerk&apos;s Privacy Policy
          </a>
        </p>

        <h3>4.2 Supabase (Database & Storage)</h3>
        <p>
          Your account data and temporarily uploaded images are stored in
          Supabase. See{" "}
          <a
            href="https://supabase.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase&apos;s Privacy Policy
          </a>
        </p>

        <h3>4.3 OpenRouter & Google (AI Processing)</h3>
        <p>
          Your room images are sent to OpenRouter, which routes them to
          Google&apos;s Gemini AI for processing. Images are processed in-memory
          and not stored. See{" "}
          <a
            href="https://openrouter.ai/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenRouter&apos;s Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Privacy Policy
          </a>
        </p>

        <h3>4.4 Stripe (Payments)</h3>
        <p>
          Payment information is processed securely through Stripe. We never see
          your card details. See{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe&apos;s Privacy Policy
          </a>
        </p>

        <h3>4.5 Upstash (Rate Limiting)</h3>
        <p>
          We use Upstash Redis for rate limiting. Only request metadata is
          stored temporarily. See{" "}
          <a
            href="https://upstash.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upstash&apos;s Privacy Policy
          </a>
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <ul>
          <li>All data transmitted over encrypted HTTPS connections</li>
          <li>Supabase handles encryption at rest for stored data</li>
          <li>API keys and secrets are securely stored and never exposed</li>
          <li>We follow industry-standard security practices</li>
          <li>Images are automatically deleted to minimize security risk</li>
        </ul>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request corrections to inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data in machine-readable format</li>
          <li>Opt-out of optional communications</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:kazakis.th@gmail.com">kazakis.th@gmail.com</a>
        </p>
      </section>

      <section>
        <h2>7. GDPR Compliance</h2>
        <p>
          For users in the EU, we comply with GDPR requirements. We process
          personal data only with your consent and provide transparent
          information about data handling. You have the right to withdraw
          consent at any time.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          We use cookies to maintain your session and improve your experience.
          You can control cookie settings in your browser. Essential cookies
          cannot be disabled as they are necessary for the service to function.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of
          significant changes via email or a prominent notice on our site. Your
          continued use of the service constitutes acceptance of changes.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our privacy
          practices, please contact us at:
        </p>
        <div className={legalContactClass}>
          <p>
            <strong>Magic Room Privacy Team</strong>
          </p>
          <p>Email: kazakis.th@gmail.com</p>
        </div>
      </section>
    </LegalPage>
  );
}
