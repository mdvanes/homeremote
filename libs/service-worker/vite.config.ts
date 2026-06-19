/// <reference types="vitest" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/libs/service-worker",
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
        passWithNoTests: true,
        coverage: {
            provider: "v8",
            reportsDirectory: "../../coverage/libs/service-worker",
            reporter: ["text", "text-summary", "lcov"],
        },
    },
});
