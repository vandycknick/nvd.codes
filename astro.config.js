import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"
import sitemap from "@astrojs/sitemap"
import expressiveCode from "astro-expressive-code"
import tailwindcss from "@tailwindcss/vite"
import orama from "@orama/plugin-astro"

import { pluginCodeOutput } from "./plugins/code-output.ts"

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
  site: "https://nvd.sh",

  markdown: {
    remarkPlugins: [remarkReadingTime],
  },

  integrations: [
    react(),
    sitemap(),
    orama({
      posts: {
        pathMatcher: /post\/.+$/,
        language: "english",
        contentSelectors: ["article"],
      },
    }),
    expressiveCode({
      themes: ["material-theme-darker"],
      plugins: [pluginCodeOutput()],
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

  vite: {
    plugins: [tailwindcss()],
  },
})
