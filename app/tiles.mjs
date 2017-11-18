import {loadTileMap} from './map.mjs'

document.body.innerHTML = "<canvas id='canv'></canvas>"

loadTileMap('resources/map.png', 40).then((tileMap) => {
  const canv = document.getElementById('canv')
  canv.width = 200
  canv.height = 200

  const ctx = canv.getContext('2d')
  tileMap.drawTile(0, ctx)
})
