/// <reference types="vitest" />
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/apps/server",
    plugins: [
        tsconfigPaths(),
        // NestJS relies on decorator metadata for dependency injection, which
        // esbuild (vitest's default transformer) does not emit. swc emits it.
        swc.vite({
            module: { type: "es6" },
            jsc: {
                target: "es2021",
                parser: { syntax: "typescript", decorators: true },
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        }),
    ],
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["src/setupTests.ts"],
        include: ["src/**/*.{test,spec}.{ts,js}"],
        reporters: ["default"],
        coverage: {
            provider: "v8",
            reportsDirectory: "../../coverage/apps/server",
            reporter: ["text", "text-summary", "lcov"],
            thresholds: {
                branches: 10,
                functions: 10,
                lines: 10,
                statements: 10,
            },
        },
    },
});
