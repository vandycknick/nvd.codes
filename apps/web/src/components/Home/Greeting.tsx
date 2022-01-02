import React from "react"
import cx from "classnames"

import { GlobeIcon } from "./Icons/Globe"
import { GitHubIcon } from "./Icons/Github"
import { TwitterIcon } from "./Icons/Twitter"
import { CodeExplosion } from "./CodeExplosion"

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
  <section className="pt-20 pb-12 flex flex-col md:flex-row">
    <div className="w-full lg:w-1/2 lg:pr-5">
      <HeadingOne>
        Hey <Text className="not-italic">👋</Text>, I&apos;m{" "}
        <Text className="underline decoration-4 decoration-frost-primary">
          Nick
        </Text>
        .
      </HeadingOne>
      <Paragraph>
        Welcome to my little space on the web. I try to write code and blog
        about my experiences. Love writing, speaking, travelling or making lots
        of random stuff. Mostly I can be found playing around with Python, .NET,
        TypeScript or JavaScript. Occasionally developing CLI tools and apps.
      </Paragraph>
      <div className="flex py-6">
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
      <CodeExplosion />
    </aside>
  </section>
)

export { Greeting }
