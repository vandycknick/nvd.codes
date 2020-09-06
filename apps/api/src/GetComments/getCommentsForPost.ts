import fetch from "node-fetch"
import { PostComments } from "@nvd.codes/core"

import config from "../config"

const query = `
query IssueComments($issueQuery: String!) {
  search(query: $issueQuery, type: ISSUE, first: 1) {
    issueCount
    edges {
      node {
        ... on Issue {
          id
          title
          url
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
          reactionGroups {
            content
            users {
              totalCount
            }
          }
        }
      }
    }
  }
  rateLimit {
    cost
    limit
    remaining
    resetAt
  }
}
`

type GraphQLResponse = {
  data: {
    search: {
      issueCount: number
      edges: {
        node: {
          id: string
          title: string
          url: string
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
          reactionGroups: { content: string; users: { totalCount: number } }[]
        }
      }[]
    }
    rateLimit: Record<string, unknown>
  }
}

const getCommentsForPost = async (
  slug: string,
): Promise<PostComments | null> => {
  const issueQuery = `${config.ISSUE_QUERY} ${slug}`
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${config.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { issueQuery },
    }),
  })

  const graph: GraphQLResponse = await response.json()

  if (graph.data.search.issueCount == 0) return null
  if (graph.data.search.issueCount > 1) return null

  const issue = graph.data.search.edges[0].node
  const comments = issue.comments.edges.map((c) => ({
    id: c.node.id,
    createdAt: c.node.createdAt,
    body: c.node.bodyHTML,
    author: {
      avatarUrl: c.node.author.avatarUrl,
      login: c.node.author.login,
    },
    reactions: c.node.reactionGroups.map((group) => ({
      content: group.content,
      count: group.users.totalCount,
    })),
  }))

  return {
    id: issue.id,
    title: issue.title,
    url: issue.url,
    reactions: issue.reactionGroups.map((group) => ({
      content: group.content,
      count: group.users.totalCount,
    })),
    comments,
    totalComments: issue.comments.totalCount,
  }
}

export default getCommentsForPost
