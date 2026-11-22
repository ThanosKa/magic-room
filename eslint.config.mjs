import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const tsFiles = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
const testFiles = [
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
  "tests/**",
  "**/__tests__/**",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // TypeScript rules from CODING_STANDARDS.md.
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration[params.length>1]:not([id.name=/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|generateMetadata|generateViewport|middleware|proxy)$/])",
          message: "Take one object argument instead of positional params.",
        },
        {
          selector: "VariableDeclarator:not([id.name=/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|generateMetadata|generateViewport|middleware|proxy)$/]) > ArrowFunctionExpression[params.length>1]",
          message: "Take one object argument instead of positional params.",
        },
      ],
    },
  },
  {
    files: testFiles,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-restricted-syntax": "off",
    },
  },
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
    ".cloudflare/**",
    ".vinext/**",
    "dist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
