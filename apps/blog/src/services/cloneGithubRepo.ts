import os from "os"
import { spawn } from "child_process"
import { promises } from "fs"
import { join } from "path"

const { mkdtemp } = promises

const run = async (
  cmd: string,
  args: string[],
  cwd?: string,
): Promise<number | null> => {
  const proc = spawn(cmd, args, { cwd })
  return new Promise((res, rej) => {
    proc.on("close", (code) => res(code))
    proc.on("error", rej)
  })
}

export const cloneGithubRepo = async (repository: string, branch: string) => {
  const projectName = repository.split("/").pop()

  const directory = await mkdtemp(join(os.tmpdir(), projectName ?? "fallback"))

  await run(
    "git",
    [
      "clone",
      "--depth",
      "1",
      "--branch",
      branch,
      `${repository}.git`,
      directory,
    ],
    directory,
  )

  return directory
}
