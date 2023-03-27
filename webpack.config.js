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
  externals: {
    // Use external version of React
    "react": {
      "commonjs": "react",
      "commonjs2": "react",
      "amd": "react",
      "root": "React"
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
