import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { publicPath } from './paths';

const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const OfflinePlugin = require('offline-plugin');

const config: webpack.Configuration = {
  mode: 'development',
  entry: {
    main: './src/index.ts',
    three: 'three'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less?$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, 
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].bundle.js',
  },
  plugins: [
    // new CleanWebpackPlugin([buildPath]),
    new HtmlWebpackPlugin({
      template: path.join(publicPath, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OfflinePlugin(),
    new InterpolateHtmlPlugin({ 'PUBLIC_URL': '' })
  ],
  devServer: {
    hot: true,
    port: 3000,
    compress: true,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: publicPath
  }
};

export default config;
