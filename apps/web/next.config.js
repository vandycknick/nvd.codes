module.exports = {
  trailingSlash: true,
  images: {
    ...(process.env.NODE_ENV === "production"
      ? { path: ["https://images.nvd.codes"], loader: "imgix" }
      : {}),
  },
}
