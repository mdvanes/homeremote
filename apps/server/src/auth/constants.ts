import { readFileSync } from "fs";
import { join } from "path";

export const getAuthConfig = () => {
    const jsonPath =
        process.env.NODE_ENV.toUpperCase() === "DEVELOPMENT"
            ? join(__dirname, "../../../apps/server/auth.json")
            : join(__dirname, "../../auth.json");
    const jsonString = readFileSync(jsonPath, "utf8");
    if (!jsonString) {
        throw Error("No auth.json found");
    }
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        throw Error("Cannot parse auth.json");
    }
};

export const jwtConstants = {
    secret: getAuthConfig().secret,
};
