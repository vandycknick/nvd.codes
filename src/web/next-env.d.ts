/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "!!raw-loader!*" {
  const contents: string
  export = contents
}

declare module "remark-slug" {
  import { Plugin, Transformer } from "unified"
  declare const slug: Plugin
  export = slug
}

declare module "rehype-shiki" {
  import { Plugin } from "unified"
  declare const shiki: Plugin<[{ theme: string }]>
  export = shiki
}

declare module "rehype-stringify" {
  import { Plugin } from "unified"
  declare const html: Plugin
  export = html
}

declare module "remark-retext" {
  import { Plugin } from "unified"
  type UnifiedPipeline = () => void
  declare const remarkRetext: Plugin<[UnifiedPipeline]>
  export = remarkRetext
}

declare module "retext-english" {
  import { Plugin } from "unified"
  declare const enlish: Plugin
  export = english
}

declare module "retext-equality" {
  import { Plugin } from "unified"
  declare const equality: Plugin
  export = equality
}

declare module "retext-smartypants" {
  import { Plugin } from "unified"
  declare const smartypants: Plugin
  export = smartypants
}

declare module "hast-util-select" {
  import { Node } from "uni"
  interface HastNode {
    type: string
    tagName: string
    properties: { [index: string]: string }
    children: HastNode[]
  }

  type SelectAll = (selector: string, tree: Node) => HastNode[]
  export const selectAll: SelectAll
}
