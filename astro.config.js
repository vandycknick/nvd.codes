import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"
import sitemap from "@astrojs/sitemap"
import expressiveCode from "astro-expressive-code"

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    // readingTime.text will give me minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readingTime = readingTime.text
  }
}

// https://astro.build/config
export default defineConfig({
  site: "https://nvd.codes",
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    expressiveCode({
      themes: ["github-dark"],
      styleOverrides: {
        frames: {
          frameBoxShadowCssValue: "0rem",
        },
      },
    }),
  ],
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
})
