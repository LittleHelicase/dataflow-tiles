
export function loadTileMap (file, tileSize) {
  var img = new Image()
  img.src = file
  return new Promise((resolve) =>
    img.addEventListener('load', resolve))
  .then(() => {
    const width = img.width / tileSize
    const height = img.height / tileSize
    return {
      drawTile: (n, ctx, canvas) => {
        const x = n % width
        const y = Math.floor(n / width)
        if (y > height) throw Error(`No tile ${n} in map.`)
        ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize)
      }
    }
  })
}
