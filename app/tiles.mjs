import {loadTileMap, drawTile} from './map.mjs'

document.body.innerHTML = "<canvas id='canv'></canvas>"

const tileSize = 133.333
var ctx, tileMap, canv
loadTileMap('resources/map.png', tileSize).then((tm) => {
  tileMap = tm
  canv = document.getElementById('canv')
})

document.drawInput = (input) => {
  var maxWidth = 0
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      maxWidth = (maxWidth > input[i].length) ? maxWidth : input[i].length
    }
  }
  canv.width = maxWidth * tileSize
  canv.height = input.length * tileSize
  ctx = canv.getContext('2d')
  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < input[i].length; j++) {
      drawTile(input[i][j], {x: j, y: i})(ctx, tileMap)
    }
  }
}
