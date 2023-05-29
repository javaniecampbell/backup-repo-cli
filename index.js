import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import { filterGitRepositories, walkFolders } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main(args) {
    const folderPaths = [path.resolve(__dirname, process.cwd())];
    // const folderPath = path.resolve(__dirname, "./")
    // const results = fs.readdirSync(path.resolve(__dirname, "./"));
    // const folders = results.filter((result) => {
    //     return fs.lstatSync(path.resolve(folderPath, result)).isDirectory();
    // });
    // console.log(folders);
    const directories = walkFolders(folderPaths, [], { depth: 0, maxDepth: Infinity });

    console.log("Directories:");
    console.log("------------\n\n");
    directories.forEach((directory) => console.log(directory));
    // console.log(directories);
    console.log("Git Directories:");
    console.log("------------\n\n");
    const gitRepositories = filterGitRepositories(folderPaths);
    console.log(gitRepositories);
    console.log("------------\n\n");
    console.log('args', args);
}

const args = process.argv.slice(2);

// (async () => {
//     await main(args);
//  })();

main(args).then(() => {
    console.log("\n\nDone 🚀🚀");
}
).catch((err) => {
    console.log(err);
});
