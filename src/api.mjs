
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
export function generateImage (input) {
  run(async () => {
    const engine = await puppeteer.initialize()
    const result = await engine.processInput(input)
    await engine.cleanUp()
    return result
  })
}

export function generateImageFromAscii (input) {
  const inputArray = input.split('\n').map((line) => line.split(' '))
  generateImage(inputArray)
}
