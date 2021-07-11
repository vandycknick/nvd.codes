declare module "remark-slug" {
  import { Plugin } from "unified"
  declare const slug: Plugin
  export = slug
}

// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push
interface GithubPushEvent {
  ref: string
  before: string
  after: string
  repository: {
    name: string
    url: string
    full_name: string
    default_branch: string
  }
  pusher: {
    name: string
    email: string
  }
}
