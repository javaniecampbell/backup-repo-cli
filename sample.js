import { exec } from "child_process";


function getGitStatus(folderPath) {
    return new Promise(function (resolve, reject) {
        exec("git status", { cwd: process.cwd() },  (err, stdout, stderr) => {
            if(err) {
                reject(err);
                return;
            }

            if(stderr) {
                reject(stderr);
                return;
            }

            resolve(stdout);

        })
    })
};



(async () => {

    const paths = [process.cwd()]
    
    const all = [];
    
    for(const path of paths) {
        const statusPromise = getGitStatus(path);
        all.push(statusPromise);
    }

    // run in parallel
    await Promise.all(all).then((results) => {
        console.log(results);
    }).catch((err) => {
        console.log(err);
    }

    );

    // run in parallel and wait for all one or more to complete
    await Promise.allSettled(all).then((results) => {
        console.log(results);
    }
    ).catch((err) => {
        console.log(err);
    }
    );

})();