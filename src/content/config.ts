import { z, defineCollection } from "astro:content"

const blog = defineCollection({
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
