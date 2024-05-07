/* eslint-disable */
export default {
    displayName: "server",
    preset: "../../jest.preset.js",
    globals: {},
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/apps/server",
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 10,
            lines: 10,
            statements: 10,
        },
    },
    coverageReporters: ["text", "text-summary", "lcov"],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
