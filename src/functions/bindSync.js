import Bind from '../classes/Bind.js'

export default function bindSync(
        port,
        publicKey=null,
        host='localhost',
        keyFile=null) {
    return new Bind().bindSync(port, publicKey, host, keyFile)
}
