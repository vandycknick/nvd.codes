import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.date(),
      categories: z.array(z.string()),
      cover: image(),
      draft: z.boolean().optional(),
    }),
})

export const collections = {
  blog,
}
