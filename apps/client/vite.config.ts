/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
    // The app reads NX_PUBLIC_* config from process.env (inlined at build time
    // by Nx). Load the matching .env files (e.g. .env.test) so those values are
    // available to tests, mirroring the previous Jest behaviour.
    const env = loadEnv(mode, __dirname, "NX_PUBLIC_");

    return {
        root: __dirname,
        cacheDir: "../../node_modules/.vite/apps/client",
        plugins: [react(), tsconfigPaths()],
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["src/setupTests.ts"],
            include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
            reporters: ["default"],
            env,
            server: {
                deps: {
                    // @mui ships .mjs files with extensionless directory imports
                    // (e.g. react-transition-group/TransitionGroupContext) that
                    // Node's native ESM resolver rejects. Inlining lets Vite
                    // resolve them.
                    inline: [/@mui\//, /react-transition-group/],
                },
            },
            coverage: {
                provider: "v8",
                reportsDirectory: "../../coverage/apps/client",
                reporter: ["text", "text-summary", "lcov"],
                thresholds: {
                    branches: 10,
                    functions: 10,
                    lines: 10,
                    statements: 10,
                },
            },
        },
    };
});
