import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        include: ["tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", ".next"],
        env: {
            // Mock environment variables to prevent module initialization errors
            NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
            SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
            STRIPE_SECRET_KEY: "sk_test_mock_key",
            STRIPE_WEBHOOK_SECRET: "whsec_test_mock_secret",
            NEXT_PUBLIC_OPENROUTER_API_KEY: "test-openrouter-key",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
