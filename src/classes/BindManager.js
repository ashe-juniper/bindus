import Bind from './Bind.js'

export default class BindManager {
    constructor() {
        this._bindTable = []

        process.on('beforeExit', (exitCode) => {
            this.closeAll()
        })
    }

    async bind(
            port,
            publicKey=null,
            host='localhost',
            keyFile=null) {
        const bind = await new Bind().bind(port, publicKey, host, keyFile)

        this._bindTable[bind.getPort()] = bind

        return bind
    }

    bindSync(
            port,
            publicKey=null,
            host='localhost',
            keyFile=null) {
        const bind = new Bind().bindSync(port, publicKey, host, keyFile)

        this._bindTable[bind.getPort()] = bind

        return bind
    }

    async close(bind) {
        if (typeof bind === 'number') {
            bind = this._bindTable[bind]
        }



        // Unregister the bind
        this.unregisterBind(bind.getPort())



        // Close the bind
        await bind.close()



        bind._reset()
    }

    closeAll() {
        this._bindTable.forEach(this._closeAllForEachBind)
    }

    registerBind(bind) {
        this._bindTable[bind.getPort()] = bind
    }

    unregisterBind(port) {
        if (port in this._bindTable) {
            delete this._bindTable[port]
        }


    }

    _closeAllForEachBind(value, key, bindTable) {
        this.close(value)
    }
}
