
const api = require('./src/api_commonjs')

/**
 * Composing tiles is done in an canvas element. For this I use
 * a headless chrome (puppeteer). Sadly node-canvas has a dependency
 * on some system libraries which make it less portable.
 *
 * Steps to create the final image
 *
 *  1. Spawn static file server (otherwise we won't have module support)
 *  2. Launch Browser and load app
 *  3. [TODO] Send input
 *  4. Take screenshot.
 */
// api.generateImage([[0, 0], [1, 1]])
api.generateImageFromAscii(
`48+66 49+67
58+5+7 59+4+6 `
)
