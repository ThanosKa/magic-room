import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-6 text-sm font-medium text-white hover:bg-purple-700"
          >
            Go home
          </Link>
          <Link
            href="/generate"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Generate designs
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

