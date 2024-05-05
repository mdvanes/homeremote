import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
    schemaFile: "", // mandatory field, but each outputFile has a specific schemaFile in our case
    apiFile: "", // mandatory field, but each outputFile has a specific apiFile in our case
    apiImport: "emptySplitApi",
    outputFiles: {
        "./apps/client/src/Services/generated/energyUsageApi.ts": {
            apiFile: "./apps/client/src/Services/emptyApi.ts",
            schemaFile: "./libs/types/definitions/energyUsage.yml",
            exportName: "energyUsageApi",
            tag: true,
        },
    },
    hooks: true,
};

export default config;
