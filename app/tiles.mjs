import {loadTileMap} from './map.mjs'
import {draw, measure} from './drawing.mjs'

document.body.innerHTML = "<canvas id='canv'></canvas>"

const tileSize = 80
var ctx, tileMap, canv
loadTileMap('resources/map.png', tileSize).then((tm) => {
  tileMap = tm
  canv = document.getElementById('canv')
})

document.drawInput = (input, library) => {
  library[" "] = input
  const size = measure(": ", {x: 0, y: 0})(ctx, tileMap, library)

  canv.width = size.width
  canv.height = size.height
  ctx = canv.getContext('2d')
  draw(': ', {x: 0, y: 0})(ctx, tileMap, library)
}
