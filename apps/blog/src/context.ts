import pkg from "typeorm"

import { inferAsyncReturnType } from "@trpc/server"
import { memoize } from "@nvd.codes/utils"

import { entities } from "./entity"
import { PostEntity } from "./entity/Post"
import { SyncPostsJob } from "./entity/SyncPostsJob"
import { getConfig } from "./config"

const { getRepository, createConnection } = pkg

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
    syncJobsRepository: getRepository(SyncPostsJob),
  }
})

export const createContext = async () => {
  const repositories = await getRepositories()
  return repositories
}

export type AppContext = inferAsyncReturnType<typeof createContext>
