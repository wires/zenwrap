# Zenwrap

Some wrapper code around Zenroom to make it behave the way I want it to and deal with some minor bugs.

- [x] No output to stdout/stderr
- [x] Exec VM mulitple times, without `RuntimeError: memory access out of bounds`
- [x] Simplified Promise / async function API
- [x] Deals with [some bug](https://github.com/DECODEproject/Zenroom/pull/86#issuecomment-591430820) in `print()` command

## Example

This Lua script will produce a trace with one element (because `print()` is called once), containing a `json` dictionary (because the printed string can be parsed as JSON) with a key `random`.

We wrap this script in a helper function `generateRandom()`.

For more details, *use the source Luke*!

```js
let zenwrap = require('zenwrap')

let script = `
random = OCTET.random(256)
result = {random = random:hex()}
s = JSON.encode(result)
print(s)
`.trim()

async function generateRandom(seed) {
    let opts = {rngseed: seed}
    let trace = await zenwork(script, null, null, opts)
    return trace[0].json.random
}

let rngseed = '04b0848f3b3b5c62c6867a6fb53d2afbdcc76d9f5d22ad7a35fdb2dbe3122ec2939feb70fb3f5887d51f7dd30461e48d460f0f0e31251f3d5023f7d123ca2947e16aa496f31775b4e509d77bf0d8895b3cca732b4a4b4d34c2195d0d7c3405e78977b5810d9eb7a3e29476ba517efd6d7504b0848f3b3b5c62c6867a6fb53d2afbdcc76d9f5d22ad7a35fdb2dbe3122ec2939feb70fb3f5887d51f7dd30461e48d460f0f0e31251f3d5023f7d123ca2947e16aa496f31775b4e509d77bf0d8895b3cca732b4a4b4d34c2195d0d7c3405e78977b5810d9eb7a3e29476ba517efd6d750d9eb7a3e29476ba0d9eb7a3e29476ba517efd6d75517efd6d756d75d6d6'

async function main () {
    let r = await generateRandom(rngseed)
    console.log('RANDOM', r)
}

main()
```

This prints:

```
RANDOM b9cfd03b70bc925b88f88254bd2ecbd33afb2995b630a93795ecd25018d4d424fc4bb7ffd3b5e55735a3d0b57a500744b719689b49f5fdc3f42232b2c26f50f80aee1b90d4fb5678f5c293cfefcddca3addd8cb9aeacdada716baf34a0f8883f697732371bdcc14eb385ae34cf3f4bd4e12e9228979ffbe0862936bc8e0e1e3140ac01b959dfa92b1a8716a5e6eae45beb9a23e857c6b18da9f183a24a9b360e34240d00beed5ff83350eb42a18210963cb8f1978c5d2afd7d91d56d51ea2e78e8eadcbc11ab6875529685da49a15acd604f2f6273200f41bdbc4874b6e4523a43cc58ae1065c94caf5d5dd1b04165a6b1a238ddf55743cbddd74a14720d29d8
```

## API

```js
const zenwrap = require('zenwrap')
zenwrap(script, keys, data, opts)
    .then(trace => console.log(trace))
```

### Rought edges

- [ ] in `silence.js`, the `uncaughtException` handler isn't removed after running the function
- [ ] There is code that deals with the double-printing-bug, should be removed when this bug is fixed
- [ ] Error handling is wonky... hard to debug probably