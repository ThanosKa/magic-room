import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-[-0.005em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-cream",
        secondary: "border-transparent bg-ink/5 text-ink-2",
        /* Purple: small highlights only (credit pill, "popular" marker). */
        accent: "border-transparent bg-accent/10 text-accent",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        outline: "border-line text-ink-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

