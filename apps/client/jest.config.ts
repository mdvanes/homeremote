/* eslint-disable */
export default {
    displayName: "client",
    preset: "../../jest.preset.js",
    globals: {},
    transform: {
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
        "^.+\\.[tj]sx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/apps/client",
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
