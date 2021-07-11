import { getRepository } from "typeorm"

import { BlogSyncJobEntity } from "../entity/BlogSyncJob"
import { startSyncPostsJob } from "./startSyncPostsJob"

type CreateSyncJobOptions = {
  type: "posts"
  branch: string
  commit: string
  repository: string
}

export const createSyncJob = async ({
  branch,
  commit,
  repository,
}: CreateSyncJobOptions) => {
  const syncRepository = getRepository(BlogSyncJobEntity)

  const job = new BlogSyncJobEntity(repository, branch, commit)

  await syncRepository.save(job)

  startSyncPostsJob({ job })

  return job.id
}
