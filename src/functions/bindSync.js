import Bind from '../classes/Bind.js'

export default function bindSync(
        port,
        publicKey=null,
        host='localhost',
        keyFile=null) {
    const bindManager = getBindManager()

    return bindManager.bind(port, publicKey, host, keyFile)
}
