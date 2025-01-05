import { defineCollection, reference, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.date(),
      categories: z.array(z.string()),
      cover: image(),
      draft: z.boolean().default(false),
      relatedPosts: z.array(reference("blog")).optional(),
    }),
})

export const collections = {
  blog,
}
