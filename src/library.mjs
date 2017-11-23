
import fs from 'fs'
import es from 'event-stream'
import reduce from 'stream-reduce'

export function loadFromFile (file) {
  return loadFromStream(fs.createReadStream(file, 'utf8'))
}

function itemStream (stream) {
  return stream.pipe(es.split('#')).pipe(es.mapSync(x => {
    const nameSplit = x.indexOf('\n')
    if (x.trim() === '') return {}
    else if (nameSplit === -1) return {[x.trim()]: ''}
    else {
      return {
        [x.slice(0, nameSplit).trim()]: x.slice(nameSplit + 1)
      }
    }
  }))
}

export function loadFromStream (stream) {
  return new Promise((resolve) =>
    itemStream(stream).pipe(reduce((cur, item) => {
      return Object.assign(cur, item)
    }, {}).on('data', resolve)))
}
