import React from "react"
import cx from "classnames"

import { GlobeIcon } from "./Icons/Globe"
import { GitHubIcon } from "./Icons/Github"
import { TwitterIcon } from "./Icons/Twitter"
import { CodeExplosionRight, CodeExplosionLeft } from "./CodeExplosion"

import { HeadingOne, Paragraph, Text } from "components/Common/Typography"

type LinkButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
  icon: React.ReactNode
}

const LinkButton = ({ href, children, className, icon }: LinkButtonProps) => (
  <a
    href={href}
    className={cx(
      "rounded-lg bg-nord-600 font-semibold text-sm px-4 py-2 text-nord-50",
      className,
    )}
  >
    {icon}
    <span className="inline-block align-middle">{children}</span>
  </a>
)

type GreetingProps = {
  githubUrl: string
  twitterUrl: string
  siteUrl: string
}

const Greeting = ({ githubUrl, twitterUrl, siteUrl }: GreetingProps) => (
  <section className="max-w-6xl mx-auto px-4 xl:px-0 pt-20 pb-12 flex justify-center">
    <aside className="hidden lg:block">
      <CodeExplosionLeft />
    </aside>
    <div className="pl-5 pr-3">
      <HeadingOne className="text-center">
        Hey <Text className="not-italic">👋</Text>, I&apos;m{" "}
        <Text className="underline decoration-4 decoration-frost-primary">
          Nick
        </Text>
        .
      </HeadingOne>
      <Paragraph className="text-center">
        Welcome to my little corner on the web! Exactly the right place where I
        can share my experiences in the world of software engineering or tell
        you a little something about myself. Love writing, speaking, travelling
        or hacking around open source or my home automation projects. If you
        ever ask me about my favourite programming language, I&apos;ll tell you
        for sure it&apos;s Python or C# or TypeScript or Go or Rust or ...
      </Paragraph>
      <div className="flex justify-center py-6">
        <LinkButton
          href={githubUrl}
          icon={
            <GitHubIcon className="fill-nord-50 w-5 h-5 inline-block pr-1" />
          }
        >
          GitHub
        </LinkButton>
        <LinkButton
          href={twitterUrl}
          className="mx-5"
          icon={
            <TwitterIcon className="fill-nord-50 w-5 h-5 inline-block pr-1" />
          }
        >
          Twitter
        </LinkButton>
        <LinkButton
          href={siteUrl}
          icon={
            <GlobeIcon className="fill-nord-50 w-5 h-5 inline-block pr-1" />
          }
        >
          Website
        </LinkButton>
      </div>
    </div>
    <aside className="hidden lg:block lg:w-1/2 lg:pl-5">
      <CodeExplosionRight />
    </aside>
  </section>
)

export { Greeting }
