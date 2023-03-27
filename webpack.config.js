const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactCommonStateHooks',
    umdNamedDefine: true
  },
  externals: ["react"],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/\.test.ts?$/, /node_modules/],
        loader: 'ts-loader',
      }
    ]
  }
}
