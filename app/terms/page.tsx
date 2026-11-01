import React from "react";
import { Metadata } from "next";
import {
  LegalPage,
  legalContactClass,
  legalLeadClass,
} from "@/components/legal-page";
import { termsMetadata } from "@/lib/seo";

export const metadata: Metadata = termsMetadata();

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="Last Updated: November 2026">
      <section>
        <p className={legalLeadClass}>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Magic
          Room (&ldquo;Service&rdquo;). By accessing or using Magic Room, you
          agree to be bound by these Terms. If you do not agree to all of these
          Terms, please do not use the Service.
        </p>
      </section>

      <section>
        <h2>1. Service Description</h2>
        <p>
          Magic Room is an AI-powered interior design tool that transforms room
          photos into design variations using advanced artificial intelligence.
          Users upload photos and provide design preferences, and the Service
          generates a redesigned version of the room.
        </p>
      </section>

      <section>
        <h2>2. User Eligibility</h2>
        <p>
          You must be at least 18 years old to use this Service. By using Magic
          Room, you represent and warrant that you meet all eligibility
          requirements.
        </p>
      </section>

      <section>
        <h2>3. Account & Use</h2>

        <h3>3.1 Account Creation</h3>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials. You agree to provide accurate and complete
          information during registration.
        </p>

        <h3>3.2 Acceptable Use</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights of others</li>
          <li>Harass, threaten, or harm individuals</li>
          <li>Attempt to gain unauthorized access to systems</li>
          <li>Scrape, crawl, or automate access without permission</li>
          <li>
            Upload content that is illegal, explicit, or violates others&apos;
            rights
          </li>
        </ul>

        <h3>3.3 Prohibited Content</h3>
        <p>
          You may not upload images containing minors without parental consent,
          images of others without permission, or any content that violates laws
          or rights of others. We reserve the right to refuse service to users
          who violate these restrictions.
        </p>
      </section>

      <section>
        <h2>4. Credits & Payments</h2>

        <h3>4.1 Credit System</h3>
        <p>
          Our Service operates on a credit-based system. Each design generation
          costs 1 credit (Quick), 2 credits (Pro) or 3 credits (Ultra). Credits are purchased separately and do not expire.
          Unused credits remain in your account indefinitely.
        </p>

        <h3>4.2 Payment Terms</h3>
        <ul>
          <li>Payments are processed through Stripe</li>
          <li>Prices are displayed in USD and include applicable taxes</li>
          <li>
            All sales are final. Credit purchases are non-refundable under any
            circumstances
          </li>
          <li>Unused credits carry no monetary value</li>
          <li>Charges appear on your statement immediately after purchase</li>
        </ul>

        <h3>4.3 Refunds</h3>
        <p>
          All sales are final. We do not issue refunds under any circumstances,
          including but not limited to unused credits, partial usage,
          dissatisfaction with generated designs, or account closure. Please
          review your purchase carefully before completing checkout.
        </p>

        <h3>4.4 Failed Generations</h3>
        <p>
          If a design generation fails due to a processing error on our end, the
          credit is automatically restored to your account balance. This credit
          restoration is a service continuity measure and does not constitute a
          monetary refund.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>

        <h3>5.1 Your Content</h3>
        <p>
          You retain all rights to images you upload. By uploading images to
          Magic Room, you grant us a limited license to process them for design
          generation. You confirm you own or have the right to share uploaded
          images.
        </p>

        <h3>5.2 Generated Designs</h3>
        <p>
          Generated designs are created by combining your input with AI models.
          You may download and use generated designs for personal or commercial
          purposes, but may not claim exclusive ownership without proper
          licensing.
        </p>

        <h3>5.3 Our Content</h3>
        <p>
          All Magic Room branding, interface design, and documentation are our
          property. You may not copy, modify, or distribute them without
          permission.
        </p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAGIC ROOM IS PROVIDED
          &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED.
        </p>
        <p>IN NO EVENT SHALL WE BE LIABLE FOR:</p>
        <ul>
          <li>Loss of revenue or profits</li>
          <li>Loss of data or business interruption</li>
          <li>Indirect, incidental, or consequential damages</li>
          <li>
            Any damages exceeding the amount you paid us in the past 6 months
          </li>
        </ul>
        <p>
          This limitation applies even if we have been advised of the
          possibility of such damages.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of Warranties</h2>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free,
          or meet your expectations. AI-generated designs may contain
          imperfections, inconsistencies, or may not match real-world
          construction standards.
        </p>
      </section>

      <section>
        <h2>8. Rate Limiting & Abuse Prevention</h2>
        <p>
          We enforce rate limits to prevent abuse and ensure service
          availability. Free users are limited to 5 generations per hour. Paid
          users receive higher limits. Attempting to circumvent rate limits may
          result in account suspension.
        </p>
      </section>

      <section>
        <h2>9. Suspension & Termination</h2>
        <p>We reserve the right to suspend or terminate your account if you:</p>
        <ul>
          <li>Violate these Terms</li>
          <li>Engage in fraudulent or abusive behavior</li>
          <li>Upload illegal or infringing content</li>
          <li>Attempt to breach our systems</li>
        </ul>
        <p>
          Suspension may result in loss of credits and account data. We will
          make reasonable efforts to notify you of suspension before it takes
          effect.
        </p>
      </section>

      <section>
        <h2>10. Third-Party Services</h2>
        <p>
          We use third-party services (Clerk, Supabase, OpenRouter, Google,
          Stripe, Upstash) to provide this Service. We are not responsible for
          their actions, policies, or failures. Your use of these services is
          governed by their respective terms and privacy policies.
        </p>
      </section>

      <section>
        <h2>11. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of material
          changes via email or prominent notice. Your continued use constitutes
          acceptance of updated Terms.
        </p>
      </section>

      <section>
        <h2>12. Dispute Resolution</h2>
        <p>
          Any disputes arising from these Terms or use of the Service shall be
          resolved through binding arbitration in accordance with the American
          Arbitration Association rules. You agree to waive your right to a jury
          trial and class action lawsuits.
        </p>
      </section>

      <section>
        <h2>13. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the United States, without
          regard to conflicts of law principles.
        </p>
      </section>

      <section>
        <h2>14. Contact Information</h2>
        <p>Questions about these Terms? Contact us at:</p>
        <div className={legalContactClass}>
          <p>
            <strong>Magic Room Legal Team</strong>
          </p>
          <p>Email: kazakis.th@gmail.com</p>
        </div>
      </section>

      <section>
        <h2>15. Entire Agreement</h2>
        <p>
          These Terms, along with our Privacy Policy, constitute the entire
          agreement between you and Magic Room regarding the Service. If any
          provision is found invalid, the remaining provisions shall remain in
          effect.
        </p>
      </section>
    </LegalPage>
  );
}
