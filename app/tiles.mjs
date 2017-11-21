import {loadTileMap} from './map.mjs'
import {draw, measure} from './drawing.mjs'

document.body.innerHTML = "<canvas id='canv'></canvas>"

const tileSize = 80
var ctx, tileMap, canv
loadTileMap('resources/map.png', tileSize).then((tm) => {
  tileMap = tm
  canv = document.getElementById('canv')
})

const combineBounds = (sizeA, sizeB) => {
  return {
    width: (sizeA.width + sizeA.x > sizeB.width + sizeB.x) ? sizeA.width + sizeA.x : sizeB.width + sizeB.x,
    height: (sizeA.height + sizeA.y > sizeB.height + sizeB.y) ? sizeA.height + sizeA.y : sizeB.height + sizeB.y,
    x: 0,
    y: 0
  }
}

const backgroundTiles = [20, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]

// put text in front of everything else and draw background tiles first.
function sorting (a, b) {
  if (a.type === 'text') return 1
  if (b.type === 'text') return -1
  else if (a.type === 'blit' && backgroundTiles.includes(a.tileId)) return -1
  else if (b.type === 'blit' && backgroundTiles.includes(b.tileId)) return 1
  return 0
}

document.drawInput = (input, library) => {
  library[' '] = input
  const size = measure(': ', {x: 0, y: 0})(tileMap, library)
    .reduce(combineBounds, {width: 0, height: 0, x: 0, y: 0})

  canv.width = size.width
  canv.height = size.height
  ctx = canv.getContext('2d')
  draw(': ', {x: 0, y: 0})(tileMap, library).sort(sorting).map((fn) => fn.fn(ctx))
}
