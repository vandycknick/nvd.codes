interface Project {
  id: string
  name: string
  description: string
  url: string
  stars: number
  languages: string[]
  primaryLanguage: RepositoryLanguage
}

interface RepositoryLanguage {
  name: string
  color: string
}

interface Activity {
  latestCommit: Commit
  projects: Project[]
}

interface Commit {
  id: string
  url: string
  message: string
  messageHeadline: string
  pushedDate: string
  repositoryName: string
}

export { Project, RepositoryLanguage, Activity, Commit }
