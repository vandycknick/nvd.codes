import { inferAsyncReturnType } from "@trpc/server"
import { getRepository, createConnection } from "typeorm"

import { CreateKoaContextOptions, memoize } from "./utils"
import { entities } from "./entity"
import { PostEntity } from "./entity/Post"
import { BlogSyncJobEntity } from "./entity/BlogSyncJob"
import { getConfig } from "./config"

const getRepositories = memoize(async () => {
  const config = getConfig()
  const driverConfig = JSON.parse(config.dbDriverConfig)
  await createConnection({
    type: config.dbType,
    username: config.dbUser,
    password: config.dbPassword,
    ...driverConfig,
    entities,
  })

  return {
    postsRepository: getRepository(PostEntity),
    syncJobsRepository: getRepository(BlogSyncJobEntity),
  }
})

export const createContext = async ({ req }: CreateKoaContextOptions) => {
  const repositories = await getRepositories()
  return {
    request: req,
    ...repositories,
  }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
