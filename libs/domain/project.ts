import { Commit, Repository } from "./git"

export interface Activity {
  latestCommit: Commit
  projects: Repository[]
}
