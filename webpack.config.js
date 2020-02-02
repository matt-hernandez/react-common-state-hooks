const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'react-common-state-hooks': './src/index.ts'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactCommonStateHooks',
    umdNamedDefine: true
  },
  externals: ["react"],
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
