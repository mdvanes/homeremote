import { writeFile } from "fs";
import { branch, short, tag } from "git-rev-sync";

const DEV = "DEV";
const PROD = "PROD";

const mode: string =
    process.argv.length >= 3 && process.argv[2] === "dev" ? DEV : PROD;

const gitDir: string = process.cwd();

const gitBranch: string = branch(gitDir);
const json: string = JSON.stringify({
    hash: mode === DEV ? "development" : short(gitDir),
    // When in detached HEAD (e.g. a Docker build on CI for a specific tag),
    // fall back to the tag name instead of "Detached HEAD".
    branch: gitBranch.indexOf("Detached") > -1 ? tag() : gitBranch,
});

const run = (): void => {
    console.log(`Setting gitinfo.json with ${json}`);
    writeFile("apps/client/src/gitinfo.json", json, "utf8", () => {
        /* no-op */
    });
};

run();
