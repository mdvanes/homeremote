import fs from "fs";
import git from "git-rev-sync";

const DEV = "DEV";
const PROD = "PROD";

const mode = process.argv.length >= 3 && process.argv[2] === "dev" ? DEV : PROD;

const json = JSON.stringify({
    hash: mode === DEV ? "development" : git.short(),
    branch: git.branch(),
});

const run = () => {
    console.log(`Setting gitinfo.json with ${json}`);
    fs.writeFile("src/gitinfo.json", json, "utf8", () => {
        /* no-op */
    });
};

run();
