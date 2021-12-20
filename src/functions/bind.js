import Bind from '../classes/Bind.js'

export default async function bind(
        port,
        publicKey=null,
        host='localhost',
        keyFile=null) {
    return await new Bind().bind(port, publicKey, host, keyFile)
}