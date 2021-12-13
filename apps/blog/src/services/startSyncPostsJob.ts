import pkg from "typeorm"

import { SyncPostsJob } from "../entity/SyncPostsJob"
import { upsertPosts } from "./upsertPosts"

const { getRepository } = pkg

type StartSyncPostsJob = {
  branch: string
  commit: string
  repository: string
}

export const startSyncPostsJob = async ({
  branch,
  commit,
  repository,
}: StartSyncPostsJob) => {
  const syncRepository = getRepository(SyncPostsJob)

  const job = new SyncPostsJob(repository, branch, commit)

  await syncRepository.save(job)

  upsertPosts({ job })

  return job.id
}
