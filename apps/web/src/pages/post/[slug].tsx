import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import ErrorPage from "next/error"
import { Post, Image } from "@nvd.codes/contracts"
import { DiscussionEmbed } from "disqus-react"

import SEO from "components/Common/SEO"
import Time from "components/Common/Time"
import { Contents } from "components/BlogPost/Content"
import { HeadingOne, Text } from "components/Common/Typography"
import {
  CalendarIcon,
  EditIcon,
  TimeIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
  RedditIcon,
  MailIcon,
} from "components/Common/Icons"
import { BackgroundImage } from "components/Common/Image"

import { getPostBySlug } from "services/blog"

type DiscussionProps = {
  slug: string
  title: string
}

const Discussion = ({ slug, title }: DiscussionProps) => {
  useEffect(() => {
    const reloadDiscussions = () => {
      setTimeout(() => DISQUS.reset({ reload: true }), 300)
    }

    document.addEventListener("themeChanged", reloadDiscussions)

    return () => document.removeEventListener("themeChanged", reloadDiscussions)
  }, [])

  return (
    <div className="not-prose">
      <DiscussionEmbed
        shortname="nvdcodes"
        config={{
          url: `https://nvd.codes/post/${slug}`,
          identifier: slug,
          title: title,
        }}
      />
    </div>
  )
}

type BlogPostProps = {
  post?: Pick<
    Post,
    | "title"
    | "description"
    | "cover"
    | "date"
    | "slug"
    | "readingTime"
    | "content"
    | "editUrl"
    | "categories"
  > & { images: Image[] }
}

const BlogPost = ({ post }: BlogPostProps) => {
  if (post == null) {
    return <ErrorPage statusCode={404} />
  }

  const postFullUrl = `https://nvd.codes/post/${post.slug}`
  const socialLinkTitle = `Nick Van Dyck: ${post.title}`

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        openGraph={{
          type: "article",
          url: `https://nvd.codes/post/${post.slug}`,
          images: [
            { url: `https://images.nvd.codes${post.cover}?w=1920&q=75` },
          ],
          article: {
            publishedTime: post.date,
            tags: post.categories,
            authors: ["Nick Van Dyck"],
          },
        }}
        additionalMetaTags={[
          {
            name: "twitter:label1",
            content: "Written by",
          },
          {
            name: "twitter:data1",
            content: "Nick Van Dyck",
          },
          {
            name: "twitter:label2",
            content: "Filed under",
          },
          {
            name: "twitter:data2",
            content: post.categories.join(", "),
          },
        ]}
      />
      <BackgroundImage
        className="w-full h-24 md:h-56 opacity-80 saturate-50 blur-[2px] bg-center bg-cover dark:blur-sm"
        src={post.cover}
        width={3840}
      />
      <div className="max-w-6xl w-full flex flex-col flex-1 mx-auto px-4 xl:px-0 py-14">
        <div className="flex flex-col items-center">
          <HeadingOne className="pb-4 text-center">{post.title}</HeadingOne>
          <div className="flex pb-6">
            <a
              href={`https://twitter.com/share?url=${postFullUrl}&text=${socialLinkTitle}`}
              className="bg-nord-600 p-2 rounded-full flex justify-center items-center mx-2"
            >
              <TwitterIcon className="h-4 w-4 fill-nord-50" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${postFullUrl}`}
              className="bg-nord-600 p-2 rounded-full flex justify-center items-center mx-2"
            >
              <LinkedInIcon className="h-4 w-4 fill-nord-50" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${postFullUrl}`}
              className="bg-nord-600 p-2 rounded-full flex justify-center items-center mx-2"
            >
              <FacebookIcon className="h-4 w-4 fill-nord-50" />
            </a>
            <a
              href={`https://reddit.com/submit?url=${postFullUrl}&title=${socialLinkTitle}`}
              className="bg-nord-600 p-2 rounded-full flex justify-center items-center mx-2"
            >
              <RedditIcon className="h-4 w-4 fill-nord-50" />
            </a>
            <a
              href={`mailto:?subject=${socialLinkTitle}&body=${postFullUrl}`}
              className="bg-nord-600 p-2 rounded-full flex justify-center items-center mx-2"
            >
              <MailIcon className="h-4 w-4 stroke-nord-50" />
            </a>
          </div>
          <div className="flex pb-14">
            <div className="flex justify-center items-center">
              <CalendarIcon className="w-5 h-5 mr-1 font-medium text-nord-600 dark:text-nord-50" />
              <Time className="font-medium" dateTime={post.date} />
            </div>
            <div className="flex justify-center items-center px-4">
              <EditIcon className="w-5 h-5 mr-1 font-medium text-nord-600 dark:text-nord-50" />
              <a
                className="font-medium text-nord-600 dark:text-nord-50"
                href={post.editUrl}
              >
                suggest edit
              </a>
            </div>
            <div className="flex justify-center items-center">
              <TimeIcon className="w-5 h-5 mr-1 font-medium text-nord-600 dark:text-nord-50" />
              <Text className="font-medium">{post.readingTime}</Text>
            </div>
          </div>
        </div>
        <article className="bg-nord-50 p-6 dark:bg-nord-700 rounded-lg prose dark:prose-invert w-full max-w-6xl drop-shadow-xl">
          <Contents
            images={post.images.reduce((map, image) => {
              map[image.url] = image
              return map
            }, {} as Record<string, Image>)}
          >
            {post.content}
          </Contents>
          <div className="" />
          <Discussion slug={post.slug} title={post.title} />
        </article>
      </div>
    </>
  )
}

const notFound = (): { notFound: true } => ({
  notFound: true,
})

export const getServerSideProps: GetServerSideProps<
  BlogPostProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug

  if (slug === undefined) {
    return notFound()
  }

  const post = await getPostBySlug({
    slug,
    fields: [
      "id",
      "title",
      "description",
      "cover",
      "date",
      "slug",
      "readingTime",
      "content",
      "editUrl",
      "images",
      "categories",
    ],
  }).catch(() => undefined)

  if (post === undefined) {
    return notFound()
  }

  return {
    props: {
      post,
    },
  }
}

export default BlogPost
