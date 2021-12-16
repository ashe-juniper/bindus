import * as Bindus from '../src/index.js';

const port = Number.parseInt(process.argv[2]);

console.log('Hosting the server.');

(async () => {
    const publicKey = await Bindus.bind(port);

    console.log('Public key:', publicKey);
})();
