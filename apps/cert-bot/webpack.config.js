/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    RenewCertificates: path.resolve(
      __dirname,
      "./src/RenewCertificates/index.ts",
    ),
    UpdateCdnCertificates: path.resolve(
      __dirname,
      "./src/UpdateCdnCertificates/index.ts",
    ),
    UpdateCertificates: path.resolve(
      __dirname,
      "./src/UpdateCertificates/index.ts",
    ),
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
    ],
  },
  optimization: {
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
