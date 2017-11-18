
const puppeteer = require('puppeteer')
const ora = require('ora')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const http = require('http')
const getPort = require('get-port')

const run = (fn) => fn()

const createServer = (port) => new Promise((resolve) => {
  const serve = serveStatic('app')
  const server = http.createServer((req, res) =>
    serve(req, res, finalhandler))
  server.listen(port)
  resolve(server)
})

const debug = process.argv[0] == '-d' || process.env.DEBUG

run(async () => {
  const spinner = ora({type: 'circleHalves', color: 'cyan'}).start()
  const port = await getPort()
  spinner.text = 'preparing...'
  const server = await createServer(port)
  var browser
  try {
    spinner.text = 'spawning browser'
    browser = await puppeteer.launch({headless: !debug})
    spinner.text = 'creating page'
    const page = await browser.newPage()
    spinner.text = 'adding script tag'
    await page.goto(`http://localhost:${port}/tileApp.html`)
    spinner.text = 'taking screenshot'
    const size = await page.evaluate(() => ({width: document.body.childNodes[0].width, height: document.body.childNodes[0].height}))
    await page.screenshot({path: 'example.png', clip: {x: 0, y: 0, width: size.width, height: size.height}})
    spinner.succeed()
    if (!debug) {
      await server.close()
      await browser.close()
    }
  } catch (err) {
    spinner.fail(err.message)
    if (!debug) {
      await server.close()
      await browser.close()
    }
  }
})
