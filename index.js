const { join } = require('path')

const { getCoordsFromFile } = require('./utils/xlsParser')
const { saveCoordsToKMZ } = require('./utils/kmzSaver')

const run = async () => {
  console.log('waiting...')
  const fileName = process.argv[2]
  if (!fileName) {
    console.log('Filename not indicated')
    closeApp()
  }

  const coords = getCoordsFromFile(join(__dirname, fileName))
  const isSaved = await saveCoordsToKMZ(coords)
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
