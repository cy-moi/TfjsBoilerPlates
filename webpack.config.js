const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: "./src/handDemo/index.js",
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
    port: 9000
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/handDemo/index.html'
    })
  ]
}