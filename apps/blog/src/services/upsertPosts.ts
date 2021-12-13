import pkg from "typeorm"

import { createLogger } from "bunyan"
import { promises } from "fs"

import { SyncPostsJob } from "../entity/SyncPostsJob"
import { getAllSlugs } from "./getAllSlugs"
import { PostEntity } from "../entity/Post"
import { uploadImageToBucket } from "./uploadImageToBucket"
import { getPostContents } from "./getPostContents"
import { parseMarkdownPost } from "./parseMarkdownPost"
import { cloneGithubRepo } from "./cloneGithubRepo"
import { parseImage } from "./parseImage"

const { getRepository } = pkg
const { rm } = promises

type SyncPostsOptions = {
  job: SyncPostsJob
}

export const upsertPosts = async ({ job }: SyncPostsOptions) => {
  const postsRepository = getRepository(PostEntity)
  const syncRepository = getRepository(SyncPostsJob)
  const logger = createLogger({ name: "sync-posts-job " })
  let directory: string | undefined = undefined

  try {
    directory = await cloneGithubRepo(job.repository, job.branch)

    logger.info({
      msg: "Downloaded source code",
      directory,
    })

    job.messages.push(`Downloaded source to ${directory}.`)

    const slugs = await getAllSlugs(directory)

    logger.info({ msg: "Slugs found on disk", slugs })

    job.messages.push(`Found ${slugs.length} posts in ${job.repository}.`)

    for (const slugInfo of slugs) {
      const postForSlug = await postsRepository.findOne({
        slug: slugInfo.slug,
      })
      const postContents = await getPostContents(slugInfo.filePath)

      if (postForSlug?.sha256 !== postContents.sha256) {
        const msg = `${
          postForSlug == undefined ? "Creating" : "Updating"
        } post ${slugInfo.slug}`
        logger.info(msg)
        job.messages.push(msg)
        const post = postForSlug ?? new PostEntity()

        const parsed = await parseMarkdownPost(
          postContents.contents,
          job.repository,
          job.branch,
          slugInfo.relativePath,
          directory,
        )

        const imageRoot = directory
        const images = await Promise.all(
          parsed.images.map((image) => parseImage(image, imageRoot)),
        )

        post.slug = slugInfo.slug
        post.title = parsed.title
        post.description = parsed.description
        post.date = parsed.date
        post.draft = parsed.draft
        post.categories = parsed.categories
        post.cover = parsed.cover
        post.placeholder = parsed.placeholder
        post.placeholderCss = parsed.placeholderCss
        post.readingTime = parsed.readingTime
        post.editUrl = parsed.editUrl
        post.content = parsed.contents
        post.sha256 = postContents.sha256
        post.images = images

        await postsRepository.save(post)

        logger.info({ msg: "Uploading images to bucket." })
        const allImages = post.images
          .map((image) => image.url)
          .concat([post.cover])

        job.messages.push(
          `Found ${allImages.length} images to upload for ${slugInfo.slug}.`,
        )
        await Promise.all(
          allImages.map((url) => uploadImageToBucket(url, imageRoot)),
        )
      } else {
        logger.info(
          `Post(${postForSlug.id}) ${postForSlug.slug} is already up to date!`,
        )
        job.messages.push(`Post ${postForSlug.slug} is already up to date!`)
      }
    }
    job.messages.push("Finished!")
  } catch (error) {
    logger.error({ ex: error })
    if (error instanceof Error) {
      job.error = error.message
    }
  } finally {
    job.finishedAt = new Date(Date.now())
    await syncRepository.save(job).catch((error) => {
      logger.error({
        msg: "Error trying to update job!",
        error,
      })
    })

    if (directory != undefined) {
      await rm(directory, { recursive: true, force: true }).catch((error) => {
        logger.error({
          msg: "Error trying to remove blog posts tmp directory.",
          error,
        })
      })
    }
  }
}
