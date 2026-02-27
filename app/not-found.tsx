import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6">
        <h1 className="text-[8rem] font-bold leading-none tracking-tighter text-slate-900 dark:text-white md:text-[12rem]">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Page not found
          </h2>
          <p className="mx-auto max-w-[600px] text-slate-500 dark:text-slate-400 md:text-xl">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed or doesn&apos;t exist.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white">
              Go back home
            </Button>
          </Link>
          <Link href="/generate">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8">
              Generate Designs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
