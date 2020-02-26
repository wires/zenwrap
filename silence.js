/// stops output to console

process.on('uncaughtException', function(err) {
    console.error((err && err.stack) ? err.stack : err);
});

module.exports = async function silent(asyncFn) {
    let ogWriteStdout = process.stdout.write.bind(process.stdout)
    let ogWriteStdErr = process.stderr.write.bind(process.stderr)

    let log = []

    let stdoutWrite = (data) => log.push({stdout: data})
    let stderrWrite = (data) => log.push({stderr: data})

    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite

    let result = await asyncFn()

    // reset stdout
    process.stdout.write = ogWriteStdout
    process.stderr.write = ogWriteStdErr

    return result
}