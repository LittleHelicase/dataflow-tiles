
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
  `48+{poly-id} 42 42 49
40 126+66 127+67 41
58 43+120+5+7 43+121+4+6 59`, {}
  /*
':poly-id',
{
  "poly-id":
    `48+{poly-id} 42 42 49
    40 126+66 127+67 41
    58 43+120+5+7 43+121+4+6 59`
}*/
)
