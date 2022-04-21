import { writeFile } from "fs";
import { short, branch, tag } from "git-rev-sync";

const DEV = "DEV";
const PROD = "PROD";

const mode = process.argv.length >= 3 && process.argv[2] === "dev" ? DEV : PROD;

const json = JSON.stringify({
    hash: mode === DEV ? "development" : short(),
    // When branch in detached state, it's likely a result from building the Docker image on CI for a specific tag
    branch: branch().indexOf('Detached') > -1 ? tag() : branch(),
});

const run = () => {
    console.log(`Setting gitinfo.json with ${json}`);
    writeFile("apps/client/src/gitinfo.json", json, "utf8", () => {
        /* no-op */
    });
};

run();
