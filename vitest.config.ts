import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        typecheck: {
            enabled: true,
            tsconfig: "./tsconfig.tests.json",
            include: ["src/**/*.ts", "tests/**/*.ts"],
        },
        coverage: {
            include: ["src/**/*.ts", "tests/**/*.ts"],
            reporter: ["text", "json"],
        },
    },
});
