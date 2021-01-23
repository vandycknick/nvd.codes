/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "!!raw-loader!*" {
  const contents: string
  export = contents
}

declare module "remark-slug" {
  import { Plugin } from "unified"
  declare const slug: Plugin
  export = slug
}
