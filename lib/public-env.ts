const REQUIRED_PUBLIC_ENV = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
] as const;

/** Lists what is wrong with the build's public env; empty when it is fine. */
export function findPublicEnvProblems(env: Record<string, string | undefined>): string[] {
  const problems: string[] = REQUIRED_PUBLIC_ENV.filter((name) => !env[name]).map(
    (name) => `${name} is missing`
  );
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.startsWith("https://")) {
    problems.push(`NEXT_PUBLIC_APP_URL must start with https:// (got ${appUrl})`);
  }
  return problems;
}
