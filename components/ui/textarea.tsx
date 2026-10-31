import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-input bg-paper px-4 py-3 text-base text-ink transition-[border-color,outline-color] duration-160 ease-out placeholder:text-ink-3 hover:border-ink/40 focus-visible:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
