/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable no-console */
/// <reference path="./lib.d.ts" />

import arg from "arg"
import { minimumLibvipsVersion } from "sharp/lib/libvips"
import { dirname, join } from "path"
import { promises as fs, constants } from "fs"
import { promisify } from "util"
import childProcess from "child_process"

const exec = promisify(childProcess.exec)

const args = arg({
  "--folder": String,
})
const vendor = `vendor/${minimumLibvipsVersion}/lib`

//Libvips got statically link into libvipc-cpp as of 8.10.5
// https://github.com/lovell/sharp-libvips/pull/81
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

  await fs.copyFile(join(folder, sharpBin), join(folder, funcDir, sharpBin))

  const libVipsDllPath = join(sharpModuleDir, vendor, libVips)
  const libVipsExists = await fileExists(libVipsDllPath)

  if (libVipsExists) {
    await fs.copyFile(libVipsDllPath, join(folder, funcDir, libVips))
    await exec(
      `patchelf --replace-needed ${libVips} ./ImageOptimizer/${libVips} ${sharpBin}`,
      {
        cwd: join(folder, funcDir),
      },
    )
  }

  await fs.copyFile(
    join(sharpModuleDir, vendor, libVipsCpp),
    join(folder, funcDir, libVipsCpp),
  )

  await exec(
    `patchelf --replace-needed ${libVipsCpp} ./ImageOptimizer/${libVipsCpp} ${sharpBin}`,
    {
      cwd: join(folder, funcDir),
    },
  )

  await fs.unlink(join(folder, sharpBin))

  return 0
}

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

main(args["--folder"])
  .then((code) => process.exit(code))
  .catch((ex) => {
    console.log(ex)
    process.exit(1)
  })
