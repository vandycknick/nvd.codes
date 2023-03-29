import React, { useEffect } from "react"
import { DiscussionEmbed } from "disqus-react"

interface IDisquss {
  reset(config: { reload: true }): void
}

declare const DISQUS: IDisquss

type DiscussionProps = {
  slug: string
  title: string
}

export const Comments = ({ slug, title }: DiscussionProps) => {
  useEffect(() => {
    const reloadDiscussions = () => {
      setTimeout(() => DISQUS.reset({ reload: true }), 300)
    }

    document.addEventListener("themeChanged", reloadDiscussions)

    return () => document.removeEventListener("themeChanged", reloadDiscussions)
  }, [])

  return (
    <div className="not-prose">
      <DiscussionEmbed
        shortname="nvdcodes"
        config={{
          url: `https://nvd.codes/post/${slug}`,
          identifier: slug,
          title: title,
        }}
      />
    </div>
  )
}
