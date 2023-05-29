import * as fs from "fs";
import path from "path";

export function filterGitRepositories(folderPaths) {
    const directories = walkFolders(folderPaths, [], { depth: 0, maxDepth: Infinity });
    const gitRepositories = directories.filter((directory) => {
        return directory.folders.includes(".git");
    });
    return gitRepositories;
}



export function walkFolders(folderPaths, dirList = [], options = { depth: 0, maxDepth: 3 }) {
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