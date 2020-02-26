let zenroom = require('zenroom')

// makes a Zencode VM compatible config string: `key1=val1, key2=val2`
function constructConfigString(options) {
    let configOpts = []
    if(options.verbose !== undefined) {
        configOpts.push(`verbose=${options.verbose}`)
    }
    if(options.rngseed) {
        configOpts.push(`rngseed="${options.rngseed}"`)
    }
    return configOpts.join(',')
}

// print output can be be doubled :O
let undouble = text => `${text.split('}{')[0]}\}`

module.exports = function zenroomP (script, keys, data, opts_) {

    let opts = opts_ || {}

    // log output if verbose > 1
    let log = (opts && opts.verbose) ? console.log.bind(console) : () => {};

    // construct configuration string
    let conf = constructConfigString(opts)
    log(`CONFIG «${conf}»`)

    return new Promise((resolve, reject) => {

        let trace = []
        let printFunction = text => {
            try {
                if (text.indexOf('}{') !== -1) {
                    let first = undouble(text)
                    let json = JSON.parse(first)
                    log('PRINT_DOUBLEJSON', json)
                    trace.push({json})
                } else {
                    let json = JSON.parse(text)
                    log('PRINT_JSON', json)
                    trace.push({json})
                }
            }
            catch(error) {
                log(`PRINT_TEXT «${text}»`)
                trace.push({text})
            }
        }
        try {
            zenroom
            .script(script)
            .print(printFunction)
            .conf(conf)
            .keys(JSON.stringify(keys))
            .data(JSON.stringify(data))
            .success(() => { 
                zenroom.reset()
                resolve(trace)
            })
            .zenroom_exec()
        }
        catch(error) {
            reject(error)
        }
    })
}
