/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")
const path = require("path")
const glob = require("fast-glob")
const CopyPlugin = require("copy-webpack-plugin")

const resolveAzureFunctions = async () => {
  const files = await glob(["src/functions/**/function.json"], { dot: false })

  const functions = files
    .map((spec) => {
      const folder = path.dirname(spec)
      const name = folder.split("/").pop()

      return [name, path.resolve(__dirname, folder, "index.ts")]
    })
    .filter(([, entrypoint]) => fs.existsSync(entrypoint))
    .reduce(
      (entry, [name, entrypoint]) => ({ ...entry, [name]: entrypoint }),
      {},
    )

  return functions
}

module.exports = async () => {
  const entry = await resolveAzureFunctions()

  return {
    mode: "production",
    target: "node",
    entry,
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
        patterns: [
          { from: "**/*.json", context: "src/functions" },
          { from: "host.json", context: "src" },
          { from: "local.settings.json", context: "src" },
        ],
      }),
    ],
  }
}
