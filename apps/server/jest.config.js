module.exports = {
    displayName: "server",
    preset: "../../jest.preset.js",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json",
        },
    },
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": "ts-jest",
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
