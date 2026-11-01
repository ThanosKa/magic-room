import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-ink/8 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
