import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { CREDIT_PACKAGES } from "@/lib/constants";
import { createCheckoutSession } from "@/lib/stripe";
import { ensureUserExists } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const CheckoutSchema = z.object({
  packageId: z.enum(["starter", "growth", "premium"]),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await ensureUserExists(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", issues: parsed.error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { packageId } = parsed.data;

    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return new Response(JSON.stringify({ error: "Package not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCheckoutSession(
      user.id,
      packageId,
      pkg.stripePriceId,
      `${appUrl}/pricing?success=true`,
      `${appUrl}/pricing?success=false`,
      user.email
    );

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      "Checkout route error"
    );
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
