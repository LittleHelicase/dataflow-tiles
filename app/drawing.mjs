
const xCoord = (pt, map) => pt.x * map.tileSize
const yCoord = (pt, map) => pt.y * map.tileSize


const combineMeasure = (sizeA, sizeB) => {
  return {
    width: (sizeA.width > sizeB.width) ? sizeA.width : sizeB.width,
    height: (sizeA.height > sizeB.height) ? sizeA.height : sizeB.height
  }
}

function drawTile (n, pt) {
  return (ctx, map) => {
    const x = n % map.width
    const y = Math.floor(n / map.width)
    if (y > map.height) throw Error(`No tile ${n} in map.`)
    ctx.drawImage(map.tileMap, x * map.tileSize, y * map.tileSize, map.tileSize, map.tileSize,
      xCoord(pt, map), yCoord(pt, map), map.tileSize, map.tileSize)
  }
}

function measureTile (n, pt) {
  return (ctx, map) => ({ width: map.tileSize, height: map.tileSize })
}

function drawText (str, pt) {
  return (ctx, map, library) => {
    const text = str.slice(1).slice(0, -1)
    ctx.font = '20pt serif'
    ctx.fillText(text, xCoord(pt, map) + map.tileSize*0.25, yCoord(pt, map) + map.tileSize*0.5)
  }
}

function measureText (str, pt) {
  return (ctx, map) => ({ width: map.tileSize, height: map.tileSize })
}

const drawBlock = (str, pt) => {
  return (ctx, map, library) => {
    const input = library[str.slice(1)]
    for (var i = 0; i < input.length; i++) {
      for (var j = 0; j < input[i].length; j++) {
        const tile = input[i][j]
        draw(tile, {x: pt.x + j, y: pt.y + i})(ctx, map, library)
      }
    }
  }
}

function measureBlock (str, pt) {
  console.log('measuring block', str)
  return (ctx, map, library) => {
    const input = library[str.slice(1)]
    var size = {width: 0, height: 0}
    for (var i = 0; i < input.length; i++) {
      for (var j = 0; j < input[i].length; j++) {
        const tile = input[i][j]
        const itemSize = measure(tile, {x: pt.x + j, y: pt.y + i})(ctx, map, library)
        size = combineMeasure(size, {width: j * map.tileSize + itemSize.width, height: i * map.tileSize + itemSize.height})
      }
    }
    return size
  }
}

const isText = (str) => {
  return str[0] === '{' && str[str.length -1] === '}'
}

const isBlock = (str) => {
  return str[0] === ':'
}

const isTile = (str) => Number(str) + '' === str

const processItem = (fns) => (str, pt) => {
  for (var i = 0; i < fns.length; i++) {
    if (fns[i][0](str, pt)) {
      console.log('chose ', i, ' for ', str)
      return fns[i][1](str, pt)
    }
  }
  throw new Error('No match for string: "' + str + '"')
}

const drawItem = processItem([
  [isText, drawText],
  [isBlock, drawBlock],
  [isTile, drawTile]
])

const measureItem = processItem([
  [isText, measureText],
  [isBlock, measureBlock],
  [isTile, measureTile]
])

const combineDraw = (a, b) => {}

const processString = (fn, combine, init) => (str, pt) => {
  const items = str.split('+')
  return (ctx, map, library) => {
    return items.reduce((res, item) => {
      console.log(fn(item, pt))
      return combine(res, fn(item, pt)(ctx, map, library))
    }, init)
  }
}

const drawString = processString(drawItem, combineDraw, null)
const measureString = processString(measureItem, combineMeasure, {width: 0, height: 0})

export function draw (input, pt) {
  console.log('drawing')
  return drawString(input, pt)
}

export function measure (input, pt) {
  console.log('measuring!!')
  return measureString(input, pt)
}
