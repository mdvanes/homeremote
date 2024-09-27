import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
    schemaFile: "", // mandatory field, but each outputFile has a specific schemaFile in our case
    apiFile: "", // mandatory field, but each outputFile has a specific apiFile in our case
    apiImport: "emptyApiWithRetry",
    outputFiles: {
        "./apps/client/src/Services/generated/energyUsageApiWithRetry.ts": {
            apiFile: "./apps/client/src/Services/emptyApiWithRetry.ts",
            schemaFile: "./libs/types/definitions/internal/energyUsage.yml",
            exportName: "energyUsageApiWithRetry",
            tag: true,
        },
        "./apps/client/src/Services/generated/smartEntitiesApiWithRetry.ts": {
            apiFile: "./apps/client/src/Services/emptyApiWithRetry.ts",
            schemaFile: "./libs/types/definitions/internal/smartEntities.yml",
            exportName: "smartEntitiesApiWithRetry",
            tag: true,
            filterEndpoints: (endpoint) =>
                !["updateSmartEntity"].includes(endpoint),
        },
        "./apps/client/src/Services/generated/smartEntitiesApi.ts": {
            apiFile: "./apps/client/src/Services/emptyApi.ts",
            schemaFile: "./libs/types/definitions/internal/smartEntities.yml",
            exportName: "smartEntitiesApi",
            apiImport: "emptyApi",
            tag: true,
        },
        "./apps/client/src/Services/generated/speedTestApiWithRetry.ts": {
            apiFile: "./apps/client/src/Services/emptyApiWithRetry.ts",
            schemaFile: "./libs/types/definitions/internal/speedTest.yml",
            exportName: "speedTestApiWithRetry",
            tag: true,
        },
    },
    hooks: true,
};

export default config;
