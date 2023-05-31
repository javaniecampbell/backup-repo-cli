import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import {
    filterGitRepositories,
    walkFolders,
    getGitStatus,
    getGitRemote,
    hasGitRemote,
    hasUnmergedFiles,
    hasUnpushedCommits,
    hasUncleanWorkingTree,
    hasStashedChanges,
    hasUntrackedFiles,
    hasUnpulledCommits,
    commitChanges
} from "./utils/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main(args) {
    // await testRun(args);

    // STEP 1:      traverse/walk all folders and subfolders recursively
    const folderPaths = [path.resolve(__dirname, process.cwd())];
    // STEP 2:      filter out all git repositories by checking if .git folder exists
    const gitRepositories = filterGitRepositories(folderPaths);
    // STEP 3:      for each git repository, get the git remote
    for (const gitRepository of gitRepositories) {
        // STEP 4:      check if there is a remote with the name "origin" or any other name
        const remote = await getGitRemote(gitRepository.folderPath);

        // STEP 5:      if exists check the git status of the repository
        const status = await getGitStatus(gitRepository.folderPath);
        console.log("status for " + gitRepository.folderPath + ":\n\n" + status + "\n\n");
        // STEP 6:      if there are any changes, then add all the changes by running the command "git add -A && git commit -m 'commit message'"
        if (hasUncleanWorkingTree(status)) {
            // await commitChanges(gitRepository.folderPath);
            console.log("hasUncleanWorkingTree");
        }
        if (hasStashedChanges(status)) {
            console.log("hasStashedChanges");
        }
        if (hasUnmergedFiles(status)) {
            console.log("hasUnmergedFiles");
        }
        if (hasUnpulledCommits(status)) {
            console.log("hasUnpulledCommits");
        }
        if (hasUntrackedFiles(status)) {
            console.log("hasUntrackedFiles");
        }
        // STEP 6.1:    if there are unpushed changes, then push all the changes by running the command "git push --all --follow-tags"
        if (hasUnpushedCommits(status)) {
            console.log("hasUnpushedCommits");
        }
        // STEP 7:      if there is no remote with the name "origin" or any other name, then add the remote by running the command "git remote add origin <url>"
        // STEP 7.1:    if there is no remote then create one by running the command "gh repo create <repo-name> --source=. --public/--private --confirm --push"
        if (!hasGitRemote(remote)) {
            console.log("No remote found for " + gitRepository.folderPath
                + "\n\n");
        }else{
            console.log("Remote found for " + gitRepository.folderPath
                + "\n\n");
        }
    }


}

const args = process.argv.slice(2);

// (async () => {
//     await main(args);
// })();

main(args).then(() => {
    console.log("\n\nDone 🚀🚀");
}
).catch((err) => {
    console.log(err);
});
async function testRun(args) {
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
    const paths = gitRepositories.map((gitRepository) => gitRepository.folderPath);
    console.log(paths.length + " git repositories found\n\n");
    for (const gitRepository of gitRepositories) {
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

