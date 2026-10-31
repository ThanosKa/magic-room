import Link from "next/link";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A message shown in the slot above the Generate button (`#generate-message`).
 * The slot is always on screen next to the main action, on desktop and phone.
 * Each message has a short title and an icon, so its meaning never rests on
 * colour alone.
 */
export interface ToolMessage {
    tone: "error" | "info";
    title: string;
    text: string;
    /** A button after the text: a link, or something to run. */
    action?: { label: string; href: string } | { label: string; onClick: () => void };
}

function credits(n: number) {
    return `${n} ${n === 1 ? "credit" : "credits"}`;
}

/** Why a chosen file was not used. The current photo stays. */
export const PHOTO_MESSAGES = {
    tooLarge: {
        tone: "error",
        title: "Photo too large",
        text: "That photo is over 20 MB, so we kept your current one. Choose a smaller photo.",
    },
    wrongType: {
        tone: "error",
        title: "File not supported",
        text: "We can only use JPG, PNG or WebP photos. Choose one of those.",
    },
    tooMany: {
        tone: "error",
        title: "One photo at a time",
        text: "Drop a single photo of the room you want to redesign.",
    },
    unreadable: {
        tone: "error",
        title: "Photo couldn't be read",
        text: "We couldn't open or resize that photo. Try another photo.",
    },
} satisfies Record<string, ToolMessage>;

/** The chosen quality costs more than the balance. */
export function notEnoughCreditsMessage(qualityName: string, cost: number, balance: number): ToolMessage {
    return {
        tone: "info",
        title: "Not enough credits",
        text: `${qualityName} uses ${credits(cost)} and you have ${balance}.`,
        action: { label: "Buy credits", href: "/pricing" },
    };
}

export const DOWNLOAD_FAILED_MESSAGE: ToolMessage = {
    tone: "error",
    title: "Download failed",
    text: "The download didn't work. Try again, or open Full screen and save the image from there.",
};

/** The request never got an answer (offline, connection dropped). */
export const NETWORK_MESSAGE: ToolMessage = {
    tone: "error",
    title: "No connection",
    text: "We couldn't reach Magic Room. Check your connection and try again.",
};

/** What to tell the user when /api/generate did not return a design. */
export function generateFailureMessage(
    status: number,
    body: unknown,
    { cost, signInAgain }: { cost: number; signInAgain: () => void }
): ToolMessage {
    const answer = (body ?? {}) as { success?: unknown; resetAt?: unknown };
    const refunded = answer.success === false;

    if (status === 401) {
        return {
            tone: "error",
            title: "Signed out",
            text: "Your session has ended, so no design was made. Sign in again and you'll come back here.",
            action: { label: "Sign in again", onClick: signInAgain },
        };
    }

    if (status === 404) {
        return {
            tone: "error",
            title: "Account not found",
            text: "We couldn't find your account, so no design was made. Sign in again to reload it.",
            action: { label: "Sign in again", onClick: signInAgain },
        };
    }

    if (status === 400) {
        return {
            tone: "error",
            title: "Photo not accepted",
            text: "We couldn't use this photo, and you were not charged. Try another photo.",
        };
    }

    // The host gave up before the server answered (no JSON body).
    if (status === 408 || status === 502 || status === 503 || status === 504) {
        return {
            tone: "error",
            title: "Timed out",
            text: "The design took too long to come back. Check your connection and try again; your balance below is up to date.",
        };
    }

    if (status === 402) {
        return {
            tone: "info",
            title: "Not enough credits",
            text: `This design uses ${credits(cost)}, more than your balance.`,
            action: { label: "Buy credits", href: "/pricing" },
        };
    }

    if (status === 429) {
        const minutes =
            typeof answer.resetAt === "number" ? Math.ceil((answer.resetAt - Date.now()) / 60_000) : 0;
        return {
            tone: "error",
            title: "Too many designs",
            text:
                minutes > 1
                    ? `You've made a lot of designs in a short time. Try again in about ${minutes} minutes.`
                    : "You've made a lot of designs in a short time. Wait a minute and try again.",
        };
    }

    if (status >= 500 && refunded) {
        return {
            tone: "error",
            title: "Generation failed",
            text: `The design could not be made. Your ${credits(cost)} were refunded, so you can try again.`,
        };
    }

    return {
        tone: "error",
        title: "Generation failed",
        text: "Something went wrong on our side and no design was made. Please try again in a moment.",
    };
}

export function ToolMessageView({ message }: { message: ToolMessage }) {
    const { action } = message;
    const Icon = message.tone === "error" ? AlertCircle : Info;
    return (
        <div
            className={cn(
                "flex gap-3 rounded-lg border px-4 py-3 text-[14px] leading-snug text-ink",
                message.tone === "error" ? "border-destructive/30 bg-destructive/5" : "border-line bg-paper-2"
            )}
        >
            <Icon
                aria-hidden="true"
                className={cn("mt-px size-[18px] shrink-0", message.tone === "error" ? "text-destructive" : "text-ink-2")}
                strokeWidth={2}
            />
            <div className="min-w-0 flex-1">
                <p>
                    <strong className="font-medium">{message.title}.</strong> {message.text}
                </p>
                {action && (
                    <div className="mt-2.5">
                        {"href" in action ? (
                            <Button asChild size="sm">
                                <Link href={action.href}>{action.label}</Link>
                            </Button>
                        ) : (
                            <Button size="sm" onClick={action.onClick}>
                                {action.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
