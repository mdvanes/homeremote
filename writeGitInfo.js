const fs = require('fs');
const git = require('git-rev-sync');

const DEV = 'DEV';
const PROD = 'PROD';

const mode = process.argv.length >= 3 && process.argv[2] === 'dev' ? DEV : PROD;

const json = JSON.stringify({
  hash: mode === DEV ? 'development' : git.short(),
  branch: git.branch()
});

console.log(`Setting gitinfo.json with ${json}`);

fs.writeFile('gitinfo.json', json, 'utf8', () => {});