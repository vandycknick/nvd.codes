export const getConfig = () => {
  return {
    blogPostsDirectory: process.env.BLOG_POSTS_DIRECTORY as string,
    blogPostsIgnoreDirs: (process.env.BLOG_POSTS_IGNORE_DIRS as string).split(
      ",",
    ),
    blogApiEndpoint: process.env.BLOG_API as string,
  }
}
