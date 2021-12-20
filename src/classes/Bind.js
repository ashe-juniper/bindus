import net from 'net'
import * as AtekNet from '@atek-cloud/network'
import { fromBase32 } from '@atek-cloud/network/dist/util.js'
import pump from 'pump'
import randomPort from 'random-port-promise'
import { readKeyFile } from 'tangerine-pie-key-pair'

export default class Bind {
    constructor() {

    }

    async bind(port, publicKey=null, host='localhost', keyFile=null) {
        if (this.isRunning()) {
            throw `Port ${port} is already bound.`
        }

        await this._bind(port, publicKey, host, keyFile)

        return this
    }

    bindSync(port, publicKey=null, host='localhost', keyFile=null) {
        // Bind the port for P2P connection
        (async () => {
            await this.bind(this._port, publicKey, this._host, keyFile)
        })()

        // Wait until this is running to return
        while (!this.isRunning()) {}

        return this
    }

    async close() {
        // If the binding is running:
        if (this.isRunning()) {
            // If this is running in server mode:
            if (typeof this._server === 'object') {
                // Close the server.
                this._server.close((err) => {
                    if (typeof this.onclose === 'function') {
                        this.onclose({ error: err })
                    }
                })
            }
            // Close the binding as soon as possible
            (async () => {
                await this._node.close()

                // Reset this binding for future use
                this._reset()
            })()
        } else {
            throw `Port ${this._port} is not currently bound.`
        }
    }

    closeSync() {
        // Bind the port for P2P connection
        (async () => {
            await this.close()
        })()

        // Wait until this is no longer running to return
        while (this.isRunning()) {}
    }

    getPort() {
        return this._port
    }

    getPublicKey() {
        return this._publicKey
    }

    getURL() {
        return this._url
    }

    isRunning() {
        return typeof this._publicKey === 'string'
    }

    async _bind(port, publicKey=null, host='localhost', keyFile=null) {
        this._reset()

        this._host = typeof host === 'string' ? host : null
        this._port = port ? Number(port) : await randomPort()
        this._publicKey = typeof publicKey === 'string' ? publicKey : null

        let remotePublicKey

        if (publicKey) {
            try {
                remotePublicKey = fromBase32(publicKey)
            } catch (e) {
                throw `Invalid public key: ${publicKey}`
            }
        }

        await this._createNode(keyFile)

        if (Buffer.isBuffer(remotePublicKey)) {
            this._startServer(remotePublicKey)

            return this
        } else {
            await this._node.listen()

            this._setEventHandlers()

            this._setProtocolHandler()

            this._publicKey = this._node.publicKeyB32

            this._url = `https://${this._publicKey}.atek.app/`

            return this
        }
    }

    async _createNode(keyFile=null) {
        const keyPair = await readKeyFile(keyFile)

        await AtekNet.setup()

        this._node = new AtekNet.Node(keyPair)
    }

    _reset() {
        // Set all fields to null
        this._host = null
        this._node = null
        this.port = null
        this._publicKey = null
        this._url = null
    }

    _setEventHandlers() {
        this._node.on('connection', sock => {
            if (typeof this.onconnection === 'function') {
                this.onconnection({ socket: sock })
            }

            sock.on('close', () => {
                // if (typeof this.onclose === 'function') {
                //     this.onclose({ socket: sock })
                // }
            })
        })
    }

    _setProtocolHandler() {
        this._node.setProtocolHandler((stream) => {
            this._connection = net.connect({
                host: this._host,
                port: this._port
            })

            pump(stream, this._connection, stream)
        })
    }

    _startServer(remotePublicKey) {
        this._server = net.createServer(async (socket) => {
            this._connection = null

            if (Buffer.isBuffer(remotePublicKey)) {
                try {
                    this._connection = await this._node.connect(remotePublicKey)

                    this._publicKey = remotePublicKey
                } catch (e) {
                    socket.destroy()

                    return
                }
            }

            if (!this._connection) {
                return
            }

            pump(socket, this._connection.stream, socket)
        }).listen(this._port)
    }

    _stopServer() {
        this._server.close((err) => {
            if (typeof this.onclose === 'function') {
                this.onclose({ error: err })
            }
        })
    }
}
