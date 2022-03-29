import { BlogController } from "@nvd.codes/contracts"
import { TRPCError } from "@trpc/server"
import { AppContext } from "../context"

type GetPostBySlug = BlogController<AppContext>["getPostBySlug"]

export const getPostBySlug: GetPostBySlug = async ({ input, ctx }) => {
  const { postsRepository } = ctx

  const post = await postsRepository.findOne({
    where: { slug: input.slug },
    relations: ["images"],
  })

  if (post == undefined) {
    throw new TRPCError({
      code: "NOT_FOUND",
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
      width: image.width,
      height: image.height,
    })),
  }
}
