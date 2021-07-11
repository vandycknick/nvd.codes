import { BlogController } from "@nvd.codes/contracts"
import { getRepository } from "typeorm"
import { TRPCError } from "@trpc/server"

import { AppContext } from "../context"
import { PostEntity } from "../entity/Post"

type GetPostBySlug = BlogController<AppContext>["getPostBySlug"]

export const getPostBySlug: GetPostBySlug = async ({ input }) => {
  const postsRepository = getRepository(PostEntity)

  const post = await postsRepository.findOne(
    { slug: input.slug },
    { relations: ["images"] },
  )

  if (post == undefined) {
    throw new TRPCError({
      code: "PATH_NOT_FOUND",
      message: `No post found for ${input.slug}.`,
    })
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.content,
    cover: post.cover,
    date: post.date.toISOString(),
    draft: post.draft,
    categories: post.categories,
    placeholder: post.placeholder,
    placeholderCss: post.placeholderCss,
    readingTime: post.readingTime,
    editUrl: post.editUrl,
    images: post.images.map((image) => ({
      url: image.url,
      placeholder: image.placeholder,
    })),
  }
}
