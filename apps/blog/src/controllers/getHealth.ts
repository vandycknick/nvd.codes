import { Context } from "koa"
import { jsonResult } from "@nvd.codes/http"

export const getHealth = async (_: Context) =>
  jsonResult({
    status: "Ok",
  })
