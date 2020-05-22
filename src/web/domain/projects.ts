export interface Project {
  id: string
  name: string
  description: string
  url: string
  stars: number
  languages: string[]
  primaryLanguage: RepositoryLanguage
}

export interface RepositoryLanguage {
  name: string
  color: string
}

export interface Activity {
  latestCommit: Commit
  projects: Project[]
}

export interface Commit {
  id: string
  url: string
  message: string
  messageHeadline: string
  pushedDate: string
  repositoryName: string
}
