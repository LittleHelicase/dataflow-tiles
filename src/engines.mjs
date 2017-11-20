
import pupp from 'puppeteer'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'
import http from 'http'
import getPort from 'get-port'

/**
 * Spawn a static file serving server on a specific port.
 * @param {string} port The listen port for the static server
 */
const createServer = (port) => new Promise((resolve) => {
  const serve = serveStatic('app')
  const server = http.createServer((req, res) =>
    serve(req, res, finalhandler))
  server.listen(port)
  resolve(server)
})

/**
 * Spawn a server on a not used port
 */
const spawnServer = async () => {
  const port = await getPort()
  const server = await createServer(port)
  server.port = port
  return {
    port,
    close: () => server.close()
  }
}

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
export const puppeteer = {
  processInput: (browser, page) => {
    return async (input, library) => {
      const size = await page.evaluate((input, library) => {
        document.drawInput(input, library)
        const canvas = document.getElementsByTagName('canvas')[0]
        return {width: canvas.width, height: canvas.height}
      }, input, library)
      await page.screenshot({path: 'output.png', clip: {x: 0, y: 0, width: size.width, height: size.height}})
    }
  },

  cleanUp: (browser, server) => {
    return async () => {
      if (!process.env.DEBUG) {
        await server.close()
        await browser.close()
      }
    }
  },

  initialize: async () => {
    const server = await spawnServer()
    const browser = await pupp.launch({headless: !process.env.DEBUG})
    const page = await browser.newPage()
    await page.goto(`http://localhost:${server.port}/tileApp.html`)

    return {
      processInput: puppeteer.processInput(browser, page),
      cleanUp: puppeteer.cleanUp(browser, server)
    }
  }
}
