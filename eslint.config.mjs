import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Server code logs through lib/logger.ts. Other lib files are imported by client code.
    files: [
      "app/api/**",
      "lib/email.ts",
      "lib/logger.ts",
      "lib/openrouter.ts",
      "lib/redis.ts",
      "lib/stripe.ts",
      "lib/supabase.ts",
    ],
    rules: {
      "no-console": "error",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
