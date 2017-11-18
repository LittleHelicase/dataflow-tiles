
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
/*`9 21 21 21 21 21 10
8 27 27 1 2 27 7
8 27 27 0 0 27 7
22 20 20 20 20 20 23`*/
`27 1 2
27 0 30
27 0 24 29 2
27 14 13 13 15`
)
