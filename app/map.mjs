
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
