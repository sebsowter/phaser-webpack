const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/js/index.js',
    phaser: ['phaser']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {  
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'phaser',
          enforce: true,
          chunks: 'initial'
        }
      }
    }
  },
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/',
        to: 'assets/'
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      title: 'Phaser Game'
    })
  ]
};
