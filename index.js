import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const folderPaths = [path.resolve(__dirname, "./")];

    const directories = walkFolders(folderPaths);

    console.log("Directories:");
    console.log("------------");
    // console.log(directories);
    directories.forEach((directory) => console.log(directory));
}


main().then(() => {
    console.log("Done");
}
).catch((err) => {
    console.log(err);
});

function walkFolders(folderPaths, dirList = [], depth = 0) {
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
        //dirList.push({ depth, folderPath, folders });
        dirList.push(innerFolderPaths);
        walkFolders(innerFolderPaths, dirList);
    });
    return dirList;
}
