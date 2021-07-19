export const getConfig = () => {
  return {
    blogApiEndpoint: process.env.BLOG_API as string,
  }
}
