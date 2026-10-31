import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-paper px-4 py-2 text-base text-ink transition-[border-color,outline-color] duration-160 ease-out placeholder:text-ink-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "hover:border-ink/40 focus-visible:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
