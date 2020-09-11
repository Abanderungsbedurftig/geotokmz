const kmz = require('gtran-kmz')
const geoJSON = require('geojson')

const { KMZ } = require('../const')

kmz.setPromiseLib(require('bluebird'))

const pointSymbol = {
  color: '#2dcd86',
  alpha: 255,
  scale: 1,
  // icon: 'http://maps.google.com/mapfiles/kml/shapes/square.png'
}

const coordToLocation = (coord, index) => ({
  name: `BS${index + 1}`,
  category: 'House',
  lat: coord.lat,
  lng: coord.lng, 
})

const dataToGeoJSON = (data) => geoJSON.parse(data, { Point: ['lat', 'lng'] })

const generateFileName = () => {
  const date = new Date()
  return `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getFullYear()}.${KMZ}`
}

const geoJSONToKMZ = (json) => {
  return kmz.fromGeoJson(json, generateFileName(), {
      symbol: pointSymbol,
      name: 'BS Locations',
    })
    .then(() => true)
    .catch(() => false)
}

module.exports.saveCoordsToKMZ = async (coords) => {
  const json = dataToGeoJSON(coords.map(coordToLocation))
  return geoJSONToKMZ(json)
}
