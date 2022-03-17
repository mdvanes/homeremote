import { readFileSync } from "fs";
import { join } from "path";

const auth = JSON.parse(
    readFileSync(join(__dirname, "../../auth.json"), "utf8")
);

export const jwtConstants = {
    secret: auth.secret,
};
