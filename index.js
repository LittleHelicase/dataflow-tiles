
const api = require('./src/api_commonjs')
const input = require('cli-ext').input
const yargs = require('yargs')
const fs = require('fs')

const argv = yargs
  .usage('Usage: $0 -i [file] -o [file]')
  .option('i', {describe: 'An input file that encodes the tiling. If none is given you will be prompted in your EDITOR.', type: 'string'})
  .option('o', {describe: 'The output png file. If none is given the file is written to stdout.', type: 'string'})
  .option('l', {describe: 'Specify a block library that predefines tiled blocks for you.', type: 'string'})
  .argv

if (!argv.i && !argv.o) {
  console.error('Invalid argument combination. It is currently not possible to use EDITOR input and write the result to stdout. Specify at least the `-i` or `-o` argument.')
  process.exit(1)
}

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
Promise.all([
  argv.l ? api.loadLibrary(argv.l) : Promise.resolve({}),
  input(argv.i)
])
.then(([lib, str]) =>
  api.generateImageFromAscii(str, lib)
    .then((image) => {
      var outStream = process.stdout

      if (argv.o) {
        outStream = fs.createWriteStream(argv.o)
      }
      outStream.write(image)
    })
)
