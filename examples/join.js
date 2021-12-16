import * as Bindus from '../src/index.js';

const port = Number.parseInt(process.argv[2]);
const publicKey = process.argv[3];

console.log('Local port:', port);

console.log('Joining the server.');
console.log('Remote public key:', publicKey);

(async () => {
    const clientPublicKey = await Bindus.bind(port, publicKey);

    console.log('Public key:', clientPublicKey);
})();
