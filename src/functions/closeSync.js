import close from './close.js'

/**
 * Close an open bind.
 * @param {number|Bind} bind
 *
 * @returns
 */
export default function closeSync(bind) {
    (async () => {
        await close(bind)
    })()

    while (bind.isRunning()) {}
}
