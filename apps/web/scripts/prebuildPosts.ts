// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../next-env.d.ts" />

import { getAllPosts, BLOG_INDEX_CACHE } from "../src/services/getAllPosts"

// eslint-disable-next-line no-console
const print = (msg: string) => console.log(msg)

const main = async () => {
  print("Prebuilding Posts Catalog")

  const posts = await getAllPosts()

  print(`Build ${posts.length} pages!`)
  print(`Pages cached to ${BLOG_INDEX_CACHE}`)
  print("Finished")
}

main()
