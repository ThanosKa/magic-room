import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Pill buttons. Primary is ink on paper; `cream` is the primary for night
 * bands. Purple is never a button colour (accent only).
 * Press: scale 0.97 on :active. Hover only on real pointers (see globals.css).
 */
const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[transform,box-shadow,background-color,color,text-decoration-color] duration-160 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-button hover:shadow-button-hover",
        cream:
          "bg-cream text-ink shadow-[0_10px_30px_rgb(0_0_0/0.25)] hover:bg-[#fff8ee]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent text-ink hover:bg-ink/5",
        secondary: "bg-ink/5 text-ink hover:bg-ink/10",
        ghost: "text-ink hover:bg-ink/5",
        link: "rounded-none text-ink underline decoration-ink/35 decoration-1 underline-offset-[6px] active:scale-100 hover:decoration-ink",
      },
      size: {
        default: "h-11 px-6 text-[15px]",
        sm: "h-9 px-4 text-sm",
        lg: "h-[52px] px-7 text-[15px]",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", class: "h-auto px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
