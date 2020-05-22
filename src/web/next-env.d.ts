/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "!!raw-loader!*" {
  const contents: string
  export = contents
}

declare module "remark-slug" {
  function slug(): void
  export = slug
}

declare module "rehype-shiki" {
  function shiki({ theme: string }): void
  export = shiki
}

declare module "rehype-stringify" {
  function html(): void
  export = html
}

declare module "remark-retext" {
  type UnifiedPipeline = () => void
  function remarkRetext(pipeline: UnifiedPipeline): void
  export = remarkRetext
}

declare module "retext-english" {
  function english(): void
  export = english
}

declare module "retext-equality" {
  function equality(): void
  export = equality
}

declare module "retext-smartypants" {
  function smartypants(): void
  export = smartypants
}
