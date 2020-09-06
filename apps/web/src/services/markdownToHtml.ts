import unified from "unified"
import remarkParse from "remark-parse"
import remarkSlug from "remark-slug"
import remarkRehype from "remark-rehype"
import rehypeShiki from "rehype-shiki"
import html from "rehype-stringify"
import remarkRetext from "remark-retext"
import english from "retext-english"
import equality from "retext-equality"
import smartypants from "retext-smartypants"
import rehypeImageOptimizer from "./rehypeImageOptimizer"

type MarkdownHtmlSettings = {
  imagesRootPath: string
  imagesDestinationPath: string
}

const markdownToHtml = async (
  markdown: string,
  settings: MarkdownHtmlSettings,
): Promise<string> => {
  const pipeline = unified()
    .use(remarkParse)
    // Any retext errors are ingored at the moment
    .use(remarkRetext, unified().use(english).use(equality).use(smartypants))
    .use(remarkSlug)
    .use(remarkRehype)
    .use(rehypeImageOptimizer, {
      rootpath: settings.imagesRootPath,
      destination: settings.imagesDestinationPath,
    })
    .use(rehypeShiki, {
      theme: "zeit",
    })
    .use(html)

  const result = await pipeline.process(markdown)
  return result.toString()
}

export default markdownToHtml
