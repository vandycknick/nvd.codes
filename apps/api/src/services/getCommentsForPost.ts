import fetch from "node-fetch"
import { PostComments } from "@nvd.codes/contracts"

import { getConfig } from "../config"
import postsToDiscussions from "../data/postsToGithubDiscussions.json"

const query = `
query GetDiscussionByNumber($number: Int!) {
  repository(owner: "nickvdyck", name: "nvd.codes") {
    discussion(number: $number) {
      id
      number
      title
      url
      author {
        login
      }
      category {
        name
      }
      reactionGroups {
        content
        users {
          totalCount
        }
      }
      comments(first: 100) {
        totalCount
        edges {
          node {
            id
            createdAt
            bodyHTML
            author {
              avatarUrl
              login
            }
            reactionGroups {
              users {
                totalCount
              }
              content
            }
          }
        }
      }
    }
  }
}
`

type GraphQLResponse = {
  data:
    | {
        repository:
          | {
              discussion: {
                id: string
                title: string
                number: number
                url: string
                author: {
                  login: string
                }
                category: {
                  name: "Posts"
                }
                reactionGroups: {
                  content: "string"
                  users: { totalCount: number }
                }[]
                comments: {
                  totalCount: number
                  edges: {
                    node: {
                      id: string
                      createdAt: string
                      bodyHTML: string
                      author: {
                        avatarUrl: string
                        login: string
                      }
                      reactionGroups: {
                        content: string
                        users: { totalCount: number }
                      }[]
                    }
                  }[]
                }
              }
            }
          | undefined
        rateLimit: Record<string, unknown>
      }
    | undefined
}

const getDiscussionForSlug = (slug: string) => {
  const post = postsToDiscussions.find((p) => p.slug == slug)
  return post?.discussion
}

const getCommentsForPost = async (slug: string): Promise<PostComments> => {
  const id = getDiscussionForSlug(slug)

  if (id === undefined) {
    throw new Error(`No discussion configured for ${slug}`)
  }

  const config = getConfig()
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${config.githubToken}`,
      "GraphQL-Features": "discussions_api",
    },
    body: JSON.stringify({
      query,
      variables: { number: id },
    }),
  })

  const graph: GraphQLResponse = await response.json()

  if (graph.data?.repository == undefined) {
    throw new Error("No data returned!")
  }

  if (graph.data.repository.discussion.number !== id) {
    throw new Error(
      `Invalid discussion: expected ${id} but returned ${graph.data.repository.discussion.number}.`,
    )
  }

  const discussion = graph.data.repository.discussion
  const reactions = discussion.reactionGroups.map((group) => ({
    content: group.content,
    count: group.users.totalCount,
  }))
  const comments = discussion.comments.edges.map((comment) => ({
    id: comment.node.id,
    createdAt: comment.node.createdAt,
    body: comment.node.bodyHTML,
    author: {
      avatarUrl: comment.node.author.avatarUrl,
      login: comment.node.author.login,
    },
    reactions: comment.node.reactionGroups.map((group) => ({
      content: group.content,
      count: group.users.totalCount,
    })),
  }))

  return {
    id: discussion.id,
    title: discussion.title,
    url: discussion.url,
    reactions,
    comments,
    totalComments: 0,
  }
}

export default getCommentsForPost
