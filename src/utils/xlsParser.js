
const XLSX = require('xlsx')

const { COORD_DIVIDER } = require('../const')

const COORD_REGEXP = /(\d{1,3})[.,°d]?(\d{0,2})[']?(\d{0,2})[.,]?(\d{0,})(?:["]|[']{2})?/

const getSheetFromWorkbook = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath)
    return workbook.Sheets[workbook.SheetNames[0]]
  } catch (e) {
    console.log('xls file not read')
    throw new Error(e)
  }
}

const getCellData = (cells, column) =>
  cells.map((cell) => cell[column])
    .filter((cell) => !!cell)

const xlsToJson = (filePath, options) => {
  const cells = XLSX.utils.sheet_to_json(getSheetFromWorkbook(filePath), { header: 'A', range: options.firstRow })
  if (options.latColumn === options.lngColumn) {
    return getCellData(cells, options.latColumn)
  }
  const latData = getCellData(cells, options.latColumn)
  const lngData = getCellData(cells, options.lngColumn)
  if (options.isRad) {
    return latData.map((d, i) => ({
      lat: Number(d),
      lng: Number(lngData[i]),
    }))
  } else {
    return latData.map((d, i) => `${d} ${lngData[i]}`)
  }
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

module.exports.getCoordsFromFile = (filePath, options) => {
  const data = xlsToJson(filePath, options)
  if (options.isRad) {
    return data
  }
  const parseredData = data.map(parseCoordData)
  return parseredData.map(([lat, lng]) => ({
    lat: calculateLngLat(lat),
    lng: calculateLngLat(lng),
  }))
}
