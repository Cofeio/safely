const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'dist')
const APP_DIR = path.resolve(__dirname, 'js')
const LESS_DIR = path.resolve(__dirname, 'less')


const entry_points = {
  index: `${APP_DIR}/index.js`,
  parent: `${APP_DIR}/parent.js`,
  child: `${APP_DIR}/child.js`
}

 
module.exports = {
  entry: entry_points,
  output: {
    publicPath: '/dist/',
    path: BUILD_DIR,
    filename: 'js/[name].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  devServer: {
    disableHostCheck: true
  }
}