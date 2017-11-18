import {loadTileMap, drawTile} from './map.mjs'

document.body.innerHTML = "<canvas id='canv'></canvas>"

loadTileMap('resources/map.png', 133.333).then((tileMap) => {
  const canv = document.getElementById('canv')
  canv.width = 300
  canv.height = 300

  const ctx = canv.getContext('2d')
  drawTile(0, {x: 0, y: 0})(ctx, tileMap)
  drawTile(14, {x: 0, y: 1})(ctx, tileMap)
  drawTile(13, {x: 1, y: 1})(ctx, tileMap)
})
