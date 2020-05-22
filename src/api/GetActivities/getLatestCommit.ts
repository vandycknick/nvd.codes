import fetch from "node-fetch"
import config from "../config"

const query = `
query {
  viewer {
    repositories(first: 1, isFork: false, orderBy: {
      field: PUSHED_AT,direction: DESC
    }, privacy: PUBLIC) {
      nodes {
        object(expression: "master") {
          __typename
          ... on Commit {
            history(first: 1) {
              nodes {
                id: oid
                url: commitUrl
                message
                messageHeadline
                pushedDate
                repositoryName: repository {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`

type GraphQLResponse = {
  data: {
    viewer: {
      repositories: {
        nodes: {
          object: {
            history: {
              nodes: {
                id: string
                url: string
                message: string
                messageHeadline: string
                pushedDate: string
                repositoryName: {
                  name: string
                }
              }[]
            }
          }
        }[]
      }
    }
  }
}

type LatestCommit = {
  id: string
  url: string
  message: string
  messageHeadline: string
  pushedDate: string
  repositoryName: string
}

const getLatestCommit = async (): Promise<LatestCommit> => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${config.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
    }),
  })

  const graph: GraphQLResponse = await response.json()
  const node = graph.data.viewer.repositories.nodes[0].object.history.nodes[0]

  return {
    id: node.id,
    url: node.url,
    message: node.message,
    messageHeadline: node.messageHeadline,
    pushedDate: node.pushedDate,
    repositoryName: node.repositoryName.name,
  }
}

export default getLatestCommit
