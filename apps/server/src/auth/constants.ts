import { readFileSync } from "fs";
import { parse, printParseErrorCode, type ParseError } from "jsonc-parser";
import { join } from "path";

export const getAuthConfig = () => {
    const jsonPath =
        (process.env.NODE_ENV ?? "production").toUpperCase() === "DEVELOPMENT"
            ? join(__dirname, "../../../apps/server/auth.json")
            : join(__dirname, "../../auth.json");
    const jsonString = readFileSync(jsonPath, "utf8");
    if (!jsonString) {
        throw Error("No auth.json found");
    }
    // auth.json is JSONC: standard JSON plus // and /* */ comments and
    // trailing commas are allowed.
    const errors: ParseError[] = [];
    const config = parse(jsonString, errors, {
        allowTrailingComma: true,
        disallowComments: false,
    });
    if (errors.length > 0) {
        const [firstError] = errors;
        throw Error(
            `Cannot parse auth.json: ${printParseErrorCode(
                firstError.error
            )} at offset ${firstError.offset}`
        );
    }
    return config;
};

export const jwtConstants = {
    secret: getAuthConfig().secret,
};
