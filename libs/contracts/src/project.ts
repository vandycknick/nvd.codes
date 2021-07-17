export interface Repository {
  id: string
  name: string
  nameWithOwner: string
  description: string
  updatedAt: string
  url: string
  stars: number
  primaryLanguage: RepositoryLanguage
}

export interface RepositoryLanguage {
  name: string
  color: string
}

export interface Commit {
  id: string
  url: string
  message: string
  messageHeadline: string
  pushedDate: string
  repositoryName: string
}

export interface Activity {
  latestCommit: Commit
  projects: Repository[]
}
