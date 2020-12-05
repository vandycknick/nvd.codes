/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable no-console */
/// <reference path="./lib.d.ts" />

import arg from "arg"
import { minimumLibvipsVersion } from "sharp/lib/libvips"
import { dirname, join } from "path"
import { promises } from "fs"
import { promisify } from "util"
import childProcess from "child_process"

const exec = promisify(childProcess.exec)
const { copyFile, unlink } = promises

const args = arg({
  "--folder": String,
})
const vendor = `vendor/${minimumLibvipsVersion}/lib`
const libVips = "libvips.so.42"
const libVipsCpp = "libvips-cpp.so.42"
const sharpBin = "sharp.node"
const funcDir = "ImageOptimizer"

async function main(folder: string | undefined): Promise<number> {
  if (folder == undefined) {
    console.log("--folder is required !!")
    return 1
  }

  const path = require.resolve("sharp/package.json")
  const sharpModuleDir = dirname(path)

  await copyFile(join(folder, sharpBin), join(folder, funcDir, sharpBin))

  await copyFile(
    join(sharpModuleDir, vendor, libVips),
    join(folder, funcDir, libVips),
  )

  await copyFile(
    join(sharpModuleDir, vendor, libVipsCpp),
    join(folder, funcDir, libVipsCpp),
  )

  await exec(
    `patchelf --replace-needed ${libVips} ./ImageOptimizer/${libVips} ${sharpBin}`,
    {
      cwd: join(folder, funcDir),
    },
  )
  await exec(
    `patchelf --replace-needed ${libVipsCpp} ./ImageOptimizer/${libVipsCpp} ${sharpBin}`,
    {
      cwd: join(folder, funcDir),
    },
  )

  await unlink(join(folder, sharpBin))

  return 0
}

main(args["--folder"])
  .then((code) => process.exit(code))
  .catch((ex) => {
    console.log(ex)
    process.exit(1)
  })
