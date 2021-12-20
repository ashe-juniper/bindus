import Bind from '../classes/Bind.js'
import getBindManager from './getBindManager.js'

export default async function bind(
        port,
        publicKey=null,
        host='localhost',
        keyFile=null) {
    const bindManager = getBindManager()

    return await bindManager.bind(port, publicKey, host, keyFile)
}
