import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
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

function filterGitRepositories(folderPaths) {
    const directories = walkFolders(folderPaths, [], { depth: 0, maxDepth: Infinity });
    const gitRepositories = directories.filter((directory) => {
        return directory.folders.includes(".git");
    });
    return gitRepositories;
}



function walkFolders(folderPaths, dirList = [], options = { depth: 0, maxDepth: 3 }) {
    if (options.depth >= options.maxDepth) {
        return;
    }
    folderPaths.forEach((folderPath) => {
        const results = fs.readdirSync(folderPath);
        const folders = results.filter((result) => {
            return fs.lstatSync(path.resolve(folderPath, result)).isDirectory();
        });
        const innerFolderPaths = folders.map((folder) => path.resolve(folderPath, folder));
        if (innerFolderPaths.length === 0) {
            return;
        }

        //innerFolderPaths.forEach((innerFolderPath) => dirList.push(innerFolderPath));
        dirList.push({ depth: options.depth + 1, folderPath, folders });
        //dirList.push(innerFolderPaths);
        walkFolders(innerFolderPaths, dirList, { depth: options.depth + 1 });

    });
    return dirList;
}
