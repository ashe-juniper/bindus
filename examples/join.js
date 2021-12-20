import * as Bindus from '../src/index.js'

const port = Number.parseInt(process.argv[2])
const publicKey = process.argv[3]

console.log('Local port:', port)

console.log('Joining the server.')

const bind = Bindus.bindSync(port, publicKey)

console.log('Remote public key:', bind.getPublicKey())

process.on('beforeExit', (exitCode) => {
    console.log("closing the bind synchronously...")
    bind.closeSync()
});
