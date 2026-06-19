/// <reference types="vitest" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/libs/types",
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.{test,spec}.{ts,js}"],
        passWithNoTests: true,
        coverage: {
            provider: "v8",
            reportsDirectory: "../../coverage/libs/types",
            reporter: ["text", "text-summary", "lcov"],
        },
    },
});
