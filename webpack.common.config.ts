import * as path from 'path';
import { Configuration } from 'webpack';
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export const common: Configuration = {
  target: 'electron-main',
  entry: {
    content: [path.resolve(__dirname, 'src', 'content.ts')],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
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
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public', 'manifest.json'),
          to: path.resolve(__dirname, 'dist', 'manifest.json'),
        },
        {
          from: path.resolve(__dirname, 'public', '_locales'),
          to: path.resolve(__dirname, 'dist', '_locales'),
        },
        {
          from: path.resolve(__dirname, 'public', 'icons', 'icon16.png'),
          to: path.resolve(__dirname, 'dist', 'icon16.png'),
        },
        {
          from: path.resolve(__dirname, 'public', 'icons', 'icon48.png'),
          to: path.resolve(__dirname, 'dist', 'icon48.png'),
        },
        {
          from: path.resolve(__dirname, 'public', 'icons', 'icon128.png'),
          to: path.resolve(__dirname, 'dist', 'icon128.png'),
        },
        {
          from: path.resolve(__dirname, 'resources', 'icon.svg'),
          to: path.resolve(__dirname, 'dist', 'resources', 'icon.svg'),
        },
      ],
    }),
  ],
};
