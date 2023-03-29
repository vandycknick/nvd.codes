import { z, defineCollection, image } from "astro:content"

const blog = defineCollection({
  schema: z.object({
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
