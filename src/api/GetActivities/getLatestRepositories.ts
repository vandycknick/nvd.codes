import fetch from "node-fetch"
import config from "../config"

const query = `
query($take: Int) {
  viewer {
    repositories(first: $take, affiliations: [OWNER], isFork: false, orderBy:  {
      field: UPDATED_AT,direction: DESC
    }, privacy: PUBLIC) {
      nodes {
        id
        name
        nameWithOwner
        description
        updatedAt
        stars: stargazers {
          totalCount
        }
        url
        primaryLanguage {
          name
          color
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
          id: string
          name: string
          nameWithOwner: string
          description: string
          updatedAt: string
          stars: {
            totalCount: number
          }
          url: string
          primaryLanguage: {
            name?: string
            color?: string
          }
        }[]
      }
    }
  }
}

type Repository = {
  id: string
  name: string
  nameWithOwner: string
  description: string
  updatedAt: string
  stars: number
  url: string
  primaryLanguage: {
    name: string
    color: string
  }
}

const getLatestRepositories = async (take = 6): Promise<Repository[]> => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${config.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { take },
    }),
  })

  const graph: GraphQLResponse = await response.json()
  return graph.data.viewer.repositories.nodes.map((repo) => {
    return {
      id: repo.id,
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      description: repo.nameWithOwner,
      updatedAt: repo.updatedAt,
      stars: repo.stars.totalCount,
      url: repo.url,
      primaryLanguage: {
        name: repo.primaryLanguage.name ?? `¯\\_(ツ)_/¯`,
        color: repo.primaryLanguage.color ?? "#ffffff",
      },
    }
  })
}

export default getLatestRepositories
