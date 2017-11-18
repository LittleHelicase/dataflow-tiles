
export function loadTileMap (file, tileSize) {
  var img = new Image()
  const imgPromise = new Promise((resolve) =>
    img.onload = resolve)
  .then(() => {
    const width = Math.round(img.width / tileSize)
    const height = Math.round(img.height / tileSize)
    return {
      tileMap: img,
      width, height,
      tileSize
    }
  })
  img.src = file
  return imgPromise
}

export function drawTile(n, pt) {
  return (ctx, map) => {
    const x = n % map.width
    const y = Math.floor(n / map.width)
    if (y > map.height) throw Error(`No tile ${n} in map.`)
    ctx.drawImage(map.tileMap, x * map.tileSize, y * map.tileSize, map.tileSize, map.tileSize,
        pt.x * map.tileSize, pt.y * map.tileSize, map.tileSize, map.tileSize)
  }
}
