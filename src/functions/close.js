import Bind from '../classes/Bind.js'
import getBindManager from './getBindManager.js'

/**
 * Close an open bind.
 * @param {number|Bind} bind
 *
 * @returns
 */
export default async function close(bind) {
    const bindManager = getBindManager()



    await bindManager.close(bind)


}
