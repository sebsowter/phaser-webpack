const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    index: './src/app/index.js',
    phaser: ['phaser']
  },
  output: {
    publicPath: '/',
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
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
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
          'file-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: 'src/data/',
        to: 'data/'
      },
      {
        from: 'src/images/',
        to: 'images/' 
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      title: 'Robo Cats'
    })
  ]
};
