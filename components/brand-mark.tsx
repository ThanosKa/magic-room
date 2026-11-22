import Image from "next/image";
import Link from "next/link";

export function BrandMark({ priority = false }: { priority?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full text-ink"
    >
      <Image
        src="/logo.png"
        alt=""
        width={26}
        height={26}
        priority={priority}
        className="size-[26px] rounded-[7px] object-contain"
      />
      <span className="text-base font-semibold tracking-[-0.02em]">Magic Room</span>
    </Link>
  );
}
