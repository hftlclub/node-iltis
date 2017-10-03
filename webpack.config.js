const webpack = require('webpack');
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

module.exports = {
  entry: {
    server: './server.ts'
  },
  target: 'node',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    devtoolModuleFilenameTemplate: function(info) {
      return 'file:///' + info.absoluteResourcePath;
    }
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    noParse: [/dtrace-provider$/, /safe-json-stringify$/, /mv/],
    rules: [
      {
        enforce: 'pre',
        exclude: ['node_modules'],
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  devtool: isProd ? "hidden-source-map" : "source-map",
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public', to: 'public' }
    ]),
    new webpack.DefinePlugin({ "global.GENTLY": false })
    //new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/)
    //new webpack.optimize.UglifyJsPlugin({ beautify: false, sourceMap: true })
  ]

};
