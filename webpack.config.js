const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  getEntries,
  getHtmlWebpackPlugins,
  getApiFallbackRewrites
} = require('./webpack.utils');

module.exports = {
  mode: 'development',
  entry: getEntries(),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.worker\.(js|ts)$/i,
        use: [{
          loader: 'comlink-loader',
          options: {
            singleton: true
          }
        }]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  resolve: {
    extensions: [ '.js' ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: {
      rewrites: getApiFallbackRewrites(),
    },
  },
  plugins:[
    ...getHtmlWebpackPlugins({isDev: true})
  ]
}