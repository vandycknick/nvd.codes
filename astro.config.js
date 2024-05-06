import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"
import sitemap from "@astrojs/sitemap"
import expressiveCode from "astro-expressive-code"
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import { definePlugin, ExpressiveCodeAnnotation } from "@expressive-code/core"
import { h } from "@expressive-code/core/hast"

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readingTime = readingTime.text
  }
}

class CollapseLines extends ExpressiveCodeAnnotation {
  /** @param {import('@expressive-code/core').AnnotationRenderOptions} context */
  render({ nodesToTransform }) {
    return nodesToTransform.map((node) => {
      return h("div.collapse-lines", node)
    })
  }
}

export function pluginCleanupPrompt() {
  return definePlugin({
    name: "Tune line height of multi line prompts so they look nicer.",
    baseStyles: `
      .collapse-lines {
        display: block;
        line-height: 1rem;
      }
    `,
    hooks: {
      preprocessCode: (context) => {
        if (context.codeBlock.language !== "ansi") return
        if (
          !!context.codeBlock.metaOptions.getBoolean("multi-prompt") === false
        )
          return

        const [first, second] = context.codeBlock.getLines()

        first.addAnnotation(
          new CollapseLines({
            inlineRange: {
              columnStart: 0,
              columnEnd: first.text.length,
            },
          }),
        )

        second.addAnnotation(
          new CollapseLines({
            inlineRange: {
              columnStart: 0,
              columnEnd: second.text.length,
            },
          }),
        )
      },
    },
  })
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
    sitemap({
      filter: (page) => page !== "", // Was used at some point. Left it empty for now to show usage. Hopefully it doesn't come back to haunt me.
    }),
    expressiveCode({
      // themes: ["one-dark-pro"],
      themes: ["slack-dark"],
      plugins: [pluginLineNumbers(), pluginCleanupPrompt()],
      defaultProps: {
        showLineNumbers: true,
        overridesByLang: {
          "ansi,cmd,powershell,sh,bash": {
            showLineNumbers: false,
          },
        },
      },
      styleOverrides: {
        codeFontFamily:
          'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        codeFontSize: "0.8rem",
        frames: {
          frameBoxShadowCssValue: "0rem",
        },
        textMarkers: {
          markBackground: "#ffffff17",
          markBorderColor: "#ffffff40",
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
