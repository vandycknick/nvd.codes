import { join } from "path"
import { readFileSync } from "fs"
import ejs from "ejs"

import { prettyDate } from "./helpers"

export const render = (resume: unknown) => {
  const filename = join(__dirname, "views/resume.ejs")
  const template = ejs.compile(readFileSync(filename, "utf8"), {
    filename: filename,
    context: { prettyDate: prettyDate },
  })
  const css = readFileSync(join(__dirname, "styles/main.css"), "utf8")
  return template({ css, resume })
}
