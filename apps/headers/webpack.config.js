/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const mode = process.env.NODE_ENV || "production"

module.exports = {
  mode,
  output: {
    filename: "worker.js",
    path: path.join(__dirname, ".dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
}
