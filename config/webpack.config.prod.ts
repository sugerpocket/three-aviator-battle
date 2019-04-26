import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { publicPath, buildPath } from './paths';

const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const OfflinePlugin = require('offline-plugin');

const extractLess = new ExtractTextWebpackPlugin({
  filename: "[name].[hash].css"
});

const config: webpack.Configuration = {
  mode: 'production',
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
        use: extractLess.extract({
          use: [
            { loader: 'css-loader' }, 
            { loader: 'less-loader' }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: buildPath
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'public' }], { ignore: ['index.html'] }),
    new HtmlWebpackPlugin({
      template: path.join(publicPath, 'index.html')
    }),
    // new BundleAnalyzerPlugin(),
    extractLess,
    new OfflinePlugin(),
    new InterpolateHtmlPlugin({ 'PUBLIC_URL': '' })
  ]
};

export default config;
