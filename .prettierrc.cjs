module.exports = {
  plugins: [require.resolve("prettier-plugin-astro")],
  parser: "typescript",
  singleQuote: false,
  trailingComma: "all",
  semi: false,
  tabWidth: 2,
  overrides: [
    {
      files: ["*.json"],
      options: {
        parser: "json",
      },
    },
    {
      files: ["*.css"],
      options: {
        parser: "css",
      },
    },
    {
      files: ["*.md"],
      options: {
        parser: "markdown",
      },
    },
    {
      files: ["*.astro"],
      options: {
        parser: "astro",
      },
    },
  ],
}
