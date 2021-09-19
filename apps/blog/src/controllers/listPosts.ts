import { BlogController } from "@nvd.codes/contracts"
import { AppContext } from "../context"

type ListPosts = BlogController<AppContext>["listPosts"]

export const listPosts: ListPosts = async ({ input, ctx }) => {
  const { skip, take } = input
  const { postsRepository } = ctx

  const [posts, total] = await postsRepository.findAndCount({
    order: {
      date: "DESC",
    },
    skip,
    take,
  })

  return {
    posts: posts.map((post) => ({
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
    })),
    total,
  }
}
