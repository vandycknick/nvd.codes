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

const getProjectActivities = async (): Promise<Activity> => {
  const response = await fetch(
    `${process.env.GATSBY_PROJECT_API}/project/activities`,
  )
  const activities = await response.json()
  return activities
}

export { Project, RepositoryLanguage, Activity, Commit }
export { getProjectActivities }
