const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if (isMainThread) {
    module.exports = function runZenroomVM(script, keys, data, opts) {
        
        let runWorker = (resolve, reject) => {
            // worker uses same file as this one
            const worker = new Worker(__filename, {
                workerData: {script, keys, data, opts}
            });
            
            // resolve / reject
            worker.on('message', resolve)
            worker.on('error', reject)
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            })
        }

        return new Promise(runWorker)
            .then(x => x.result);
    };
} else {
    const zenwrap = require('./wrapper.js');
    const silent = require('./silence.js');
    const { script, keys, data, opts } = workerData;
    let run = () => zenwrap(script, keys, data, opts)
    let beSilent = !(opts && opts.verbose > 0)
    let P = (beSilent ? silent(run) : run())
    P.then(x => parentPort.postMessage({ result: x }))
        .catch(err => parentPort.postMessage({ error: err }))
}