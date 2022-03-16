import { writeFile } from "fs";
import { short, branch } from "git-rev-sync";

const DEV = "DEV";
const PROD = "PROD";

const mode = process.argv.length >= 3 && process.argv[2] === "dev" ? DEV : PROD;

const json = JSON.stringify({
    hash: mode === DEV ? "development" : short(),
    branch: branch(),
});

const run = () => {
    console.log(`Setting gitinfo.json with ${json}`);
    writeFile("apps/client/src/gitinfo.json", json, "utf8", () => {
        /* no-op */
    });
};

run();
