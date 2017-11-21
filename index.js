
const api = require('./src/api_commonjs')

/**
 * Composing tiles is done in an canvas element. For this I use
 * a headless chrome (puppeteer). Sadly node-canvas has a dependency
 * on some system libraries which makes it less portable.
 *
 * Steps to create the final image
 *
 *  1. Spawn static file server (otherwise we won't have module support)
 *  2. Launch Browser and load app
 *  3. [TODO] Send input
 *  4. Take screenshot.
 */
api.generateImageFromAscii(
`:poly-id 0 0 0 :poly-id


0 136+110+76 134+122+21 122+123 122+123 135+122 137`,
  {
    'poly-id':
      `48+{poly-id} 42 42 49
      40 20+126+66 20+127+67 41
      58 43+120+5+7 43+121+4+6 59`
  }
)
