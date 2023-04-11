import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"
import sitemap from "@astrojs/sitemap"

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readingTime = readingTime.text
  }
}

// https://astro.build/config
export default defineConfig({
  site: "https://nvd.codes",
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "github-dark",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
  integrations: [tailwind(), react(), sitemap()],
  experimental: {
    assets: true,
  },
  image: {
    service: "astro/assets/services/sharp",
  },
})
