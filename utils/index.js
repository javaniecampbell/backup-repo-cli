import * as fs from "fs";
import path from "path";
import { spawn, exec } from "child_process";

export function filterGitRepositories(folderPaths) {
    const directories = walkFolders(folderPaths, [], { depth: 0, maxDepth: Infinity });
    const gitRepositories = directories.filter((directory) => {
        return directory.folders.includes(".git");
    });
    return gitRepositories;
}

export function hasGitRemote(data) {
    return data.includes("http");
}

export function hasUncleanWorkingTree(data) {
    return data.includes("Changes not staged for commit");
}

export function hasUnpushedCommits(data) {
    return data.includes("Your branch is ahead of");
}

export function hasUnpulledCommits(data) {
    return data.includes("Your branch is behind");
}

export function hasUntrackedFiles(data) {
    return data.includes("Untracked files");
}

export function hasUnmergedFiles(data) {
    return data.includes("Unmerged paths");
}

export function hasStashedChanges(data) {
    return data.includes("Changes to be committed");
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

export function getGitStatus(folderPath) {
    return new Promise((resolve, reject) => {
        const git = spawn("git", ["status"], { cwd: folderPath });
        let result = '';
        git.stdout.on("data", (data) => {
            result += data.toString();
        });
        git.stderr.on("data", (data) => {
            reject(data.toString());
        });

        git.on("error", (err) => {
            reject(err);
        });

        git.on("close", (code, signal) => {
            if (code !== 0) {
                reject(`git status exited with code ${code}`);
            }
            if (signal) {
                reject(`git status was killed with signal ${signal}`);
            }
            resolve(result);
        });
    });
}

export function getGitRemote(folderPath) {
    return new Promise((resolve, reject) => {
        const git = spawn("git", ["remote", "-v"], { cwd: folderPath });
        let result = '';
        git.stdout.on("data", (data) => {
            result += data.toString();
        });
        git.stderr.on("data", (data) => {
            reject(data.toString());
        });

        git.on("error", (err) => {
            reject(err);
        });

        git.on("close", (code, signal) => {
            if (code !== 0) {
                reject(`git status exited with code ${code}`);
            }
            if (signal) {
                reject(`git status was killed with signal ${signal}`);
            }
            resolve(result);
        });

    });
}

export function commitChanges(folderPath, message = null) {
    return new Promise((resolve, reject) => {
        exec(`git add -A && git commit -am "feat: commit changes for cli backup process ${message}"`, { cwd: folderPath }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}