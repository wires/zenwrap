
let zenwork = require('../zenwork')

let script = `
random = OCTET.random(256)
result = {random = random:hex()}
s = JSON.encode(result)
print(s)
`.trim()

async function generateRandom(seed) {
    let opts = {rngseed: seed, verbose: 1}
    let trace = await zenwork(script, null, null, opts)
    return trace[0].json.random
}

let rngseed = '04b0848f3b3b5c62c6867a6fb53d2afbdcc76d9f5d22ad7a35fdb2dbe3122ec2939feb70fb3f5887d51f7dd30461e48d460f0f0e31251f3d5023f7d123ca2947e16aa496f31775b4e509d77bf0d8895b3cca732b4a4b4d34c2195d0d7c3405e78977b5810d9eb7a3e29476ba517efd6d7504b0848f3b3b5c62c6867a6fb53d2afbdcc76d9f5d22ad7a35fdb2dbe3122ec2939feb70fb3f5887d51f7dd30461e48d460f0f0e31251f3d5023f7d123ca2947e16aa496f31775b4e509d77bf0d8895b3cca732b4a4b4d34c2195d0d7c3405e78977b5810d9eb7a3e29476ba517efd6d750d9eb7a3e29476ba0d9eb7a3e29476ba517efd6d75517efd6d756d75d6d6'

async function main () {
    let r = await generateRandom(rngseed)
    console.log('RANDOM', r)

    let expected = 'b9cfd03b70bc925b88f88254bd2ecbd33afb2995b630a93795ecd25018d4d424fc4bb7ffd3b5e55735a3d0b57a500744b719689b49f5fdc3f42232b2c26f50f80aee1b90d4fb5678f5c293cfefcddca3addd8cb9aeacdada716baf34a0f8883f697732371bdcc14eb385ae34cf3f4bd4e12e9228979ffbe0862936bc8e0e1e3140ac01b959dfa92b1a8716a5e6eae45beb9a23e857c6b18da9f183a24a9b360e34240d00beed5ff83350eb42a18210963cb8f1978c5d2afd7d91d56d51ea2e78e8eadcbc11ab6875529685da49a15acd604f2f6273200f41bdbc4874b6e4523a43cc58ae1065c94caf5d5dd1b04165a6b1a238ddf55743cbddd74a14720d29d8'

    if(r !== expected) {
        throw new Error('Hmm, not expected deterministic random number')
    } else {
        console.log('OK, get expected result')
    }
}

main()