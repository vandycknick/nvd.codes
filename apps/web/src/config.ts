export const getConfig = () => {
  return {
    blogApiEndpoint: process.env.BLOG_API_PUBLIC as string,
  }
}
