const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    GetActivities: path.resolve(__dirname, "./src/GetActivities/index.ts"),
    GetComments: path.resolve(__dirname, "./src/GetComments/index.ts"),
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
