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

const ALLOWED_COMMENTS = [
  /^\s*prettier-ignore\s*$/,
  /^\s*eslint-(disable|enable)/,
  /^\s*@(vitest|jest)-environment\s/,
  /^\s*(@vite-ignore|webpackIgnore:)/,
  /^\/\s*<reference\s/,
  /https?:\/\/\S+/,
  /\b(copyright|license|SPDX-License-Identifier)\b/i,
];

function isDocOnExport(comment, source) {
  if (comment.type !== "Block" || !comment.value.startsWith("*")) return false;
  return source.getTokenAfter(comment, { includeComments: false })?.value === "export";
}

const noComments = {
  meta: {
    type: "suggestion",
    messages: {
      banned:
        "Delete this comment and let the code say it. Allowed: a license header, prettier-ignore, /** */ on an export, or a link to the issue, RFC or vendor doc that forces the behaviour.",
    },
  },
  create(context) {
    const source = context.sourceCode;
    return {
      Program() {
        for (const comment of source.getAllComments()) {
          if (comment.type === "Shebang") continue;
          if (isDocOnExport(comment, source)) continue;
          if (ALLOWED_COMMENTS.some((pattern) => pattern.test(comment.value))) continue;
          context.report({ loc: comment.loc, messageId: "banned" });
        }
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
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
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: { local: { rules: { "no-comments": noComments } } },
    rules: { "local/no-comments": "error" },
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
