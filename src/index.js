const { join } = require('path')

const { getCoordsFromFile } = require('./utils/xlsParser')
const { saveCoordsToKMZ } = require('./utils/kmzSaver')

const argv = require('minimist')(process.argv.slice(1))

const getFullPath = (scriptPath, fileName) => {
  const arr = scriptPath.split('/')
  arr.pop()
  return join(arr.join('/'), fileName)
}

const run = async () => {
  console.log('waiting...')
  const { _, src, lat, lng, title, row } = argv
  if (!src) {
    console.log('Filename not indicated')
    closeApp()
  }

  const options = {
    latColumn: lat,
    lngColumn: lng,
    isRad: _.includes('rad'),
    title,
    firstRow: row,
  }
  const coords = getCoordsFromFile(getFullPath(_[0], src), options)
  const isSaved = await saveCoordsToKMZ(coords, title || 'BS')
  if (!isSaved) {
    console.log('saving file error')
    closeApp()
  }

  console.clear()
  console.log('completed\nfile saved on this directory')
}

const closeApp = () => {
  console.log('script completed with error')
  process.exit(1)
}

const catchError = (error) => {
  console.error(error)
  process.exit(1)
}

process.on('error', closeApp)
process.on('uncaughtException', catchError)

run()
