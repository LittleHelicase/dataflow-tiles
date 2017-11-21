
const xCoord = (pt, map) => pt.x * map.tileSize
const yCoord = (pt, map) => pt.y * map.tileSize

function drawTile (n, pt) {
  return (map, library) => {
    const x = n % map.width
    const y = Math.floor(n / map.width)
    if (y > map.height) throw Error(`No tile ${n} in map.`)
    return [
      {
        type: 'blit',
        tileId: n,
        fn: (ctx) =>
          ctx.drawImage(map.tileMap, x * map.tileSize, y * map.tileSize, map.tileSize, map.tileSize,
            xCoord(pt, map), yCoord(pt, map), map.tileSize, map.tileSize)
      }
    ]
  }
}

function measureTile (n, pt) {
  return (map) => [{ width: map.tileSize, x: pt.x * map.tileSize, height: map.tileSize, y: pt.y * map.tileSize }]
}

function drawText (str, pt) {
  return (map, library) => {
    const text = str.slice(1).slice(0, -1)
    return [
      {
        type: 'text',
        fn: (ctx) => {
          ctx.font = '24px Arial'
          ctx.fillText(text, xCoord(pt, map) + map.tileSize * 0.25, yCoord(pt, map) + map.tileSize * 0.5)
        }
      }
    ]
  }
}

function measureText (str, pt) {
  return (map) => [{ width: map.tileSize, x: pt.x * map.tileSize, height: map.tileSize, y: pt.y * map.tileSize }]
}

const processBlock = (fn) => (str, pt) => {
  return (map, library) => {
    const input = library[str.slice(1)]
    return input.reduce((ops, row, i) => {
      return ops.concat(row.reduce((innerOps, tile, j) => innerOps.concat(fn(tile, {x: pt.x + j, y: pt.y + i})(map, library)), []))
    }, [])
  }
}

const drawBlock = processBlock(draw)
const measureBlock = processBlock(measure)

const isText = (str) => {
  return str[0] === '{' && str[str.length - 1] === '}'
}

const isBlock = (str) => {
  return str[0] === ':'
}

const isTile = (str) => Number(str) + '' === str

const processItem = (fns) => (str, pt) => {
  for (var i = 0; i < fns.length; i++) {
    if (fns[i][0](str, pt)) {
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

const combineArray = (a, b) => a.concat(b)

const processString = (fn, combine) => (str, pt) => {
  const items = str.split('+')
  return (map, library) => {
    return items.reduce((res, item) => {
      return combineArray(res, fn(item, pt)(map, library))
    }, [])
  }
}

const drawString = processString(drawItem)
const measureString = processString(measureItem)

export function draw (input, pt) {
  return drawString(input, pt)
}

export function measure (input, pt) {
  return measureString(input, pt)
}
