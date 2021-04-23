import * as path from 'path';
import { Configuration } from 'webpack';
const CopyPlugin = require('copy-webpack-plugin');

export const common: Configuration = {
  target: 'electron-main',
  entry: {
    content: [
      path.resolve(__dirname, 'src', 'content.ts')
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public', 'manifest.json'),
        to: path.resolve(__dirname, 'dist', 'manifest.json')
      }]
    })
  ]
};
