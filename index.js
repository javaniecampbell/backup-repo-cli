import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import { filterGitRepositories, walkFolders, getGitStatus, getGitRemote } from "./utils/index.js";
import { get } from "http";

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
    // console.log(gitRepositories);
    const paths = gitRepositories.map((gitRepository) => gitRepository.folderPath)
    console.log(paths.length + " git repositories found\n\n");
    for(const gitRepository of gitRepositories) {
        // const status = await getGitStatus(path);
        // console.log(status);
        try {
            const remote = await getGitRemote(gitRepository.folderPath);
            console.log(remote.length > 0 ? remote : "No remote found for " + gitRepository.folderPath);
            console.log("\n\n");
        } catch (error) {
            console.log(error.message ?? "No remote found for " + path);
            console.log("\n\n");
        }
       
    }
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
