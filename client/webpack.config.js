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
        test: /\.less$/,
        use: [
         {
           loader: 'style-loader'
         },
         {
           loader: 'css-loader'
         },
         {
           loader: 'less-loader'
         }
        ]
       },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      { test: /\.css$/,  loader: `style-loader!css-loader`},
      { test: /\.(png|jpg|svg)$/, loader: "url-loader?limit=8192"}
    ],
  },
  devServer: {
    disableHostCheck: true
  }
}