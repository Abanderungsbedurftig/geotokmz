
const XLSX = require('xlsx')

const { COORD_DIVIDER } = require('../const')

const COORD_REGEXP = /(\d{1,3})[.,°d]?(\d{0,2})[']?(\d{0,2})[.,]?(\d{0,})(?:["]|[']{2})?/

const xlsToJson = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet, { header: 'A' }).map((cell) => cell.A)
}

const parseCoordData = (data) => 
  data.split(COORD_DIVIDER)
    .map((coord) => {
      const parts = coord.match(COORD_REGEXP)
      return {
        degr: Number(parts[1]),
        min: Number(parts[2]),
        sec: Number(parts[3]),
      }
    })

const calculateLngLat = (data) => data.degr + (data.min / 60.0) + (data.sec / 3600.0)

module.exports.getCoordsFromFile = (filePath) => {
  const data = xlsToJson(filePath)
  console.log(data)
  const parseredData = data.map(parseCoordData)
  console.log(parseredData)
  return parseredData.map(([lat, lng]) => ({
    lat: calculateLngLat(lat),
    lng: calculateLngLat(lng),
  }))
}
