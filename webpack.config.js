const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'tokmz.js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'node',
  mode: 'production'
}
