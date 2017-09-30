const webpack = require('webpack');
const path = require("path");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

module.exports = {
  entry: {
    server: './server.ts'
  },
  target: 'node',
  output: {
    //path: path.resolve('./dist'),
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
    new webpack.DefinePlugin({ "global.GENTLY": false })
    //new webpack.optimize.UglifyJsPlugin({ beautify: false, sourceMap: true })
  ]

};
