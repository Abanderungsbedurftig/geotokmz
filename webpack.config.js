const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'tokmz.js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production'
}
