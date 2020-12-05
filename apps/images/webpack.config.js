/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    ImageOptimizer: path.resolve(__dirname, "./src/ImageOptimizer/index.ts"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: "node-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
  // externals: {
  //   sharp: "sharp",
  // },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2,
        },
      },
    },
  },
  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, ".dist"),
    libraryTarget: "commonjs",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "**/*.json", context: "src/" }],
    }),
  ],
}
