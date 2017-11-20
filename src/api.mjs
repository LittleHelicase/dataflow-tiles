
import {puppeteer} from './engines'

const run = (fn) => fn()

/**
 * Create an image from the input using the tileMap.
 * @param {Array<Array<Number>>} input A row major input array that encodes
 * the tiling. Each field encodes which tile to use where. For
 * example `input = [[0, 0], [1, 1]]` would place two 0-indexed tiles
 * in the first row and two 1-indexed tiles in the second column
 * @returns {Promise<Buffer>} Returns a promise which resolves to the
 * generated image for the input.
 */
export function generateImage (input, library) {
  run(async () => {
    const engine = await puppeteer.initialize()
    const result = await engine.processInput(input, library || {})
    await engine.cleanUp()
    return result
  })
}

const preprocessString = (str) => {
  return str.split('\n').map((line) => line.trim().split(' ').filter((cnt) => cnt !== ''))
}

export function generateImageFromAscii (input, library) {
  const inputArray = preprocessString(input)
  for (var key in library) {
    if (typeof (library[key]) === 'string') {
      library[key] = preprocessString(library[key])
    }
  }
  generateImage(inputArray, library || {})
}
