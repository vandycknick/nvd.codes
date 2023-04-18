import { Container } from "@/components/Container"
import { TwitterIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons"

type GreetingProps = {
  githubUrl: string
  twitterUrl: string
  linkedinUrl: string
}

const Greeting = ({ githubUrl, twitterUrl, linkedinUrl }: GreetingProps) => (
  <Container as="section" className="py-16">
    <div className="flex justify-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl italic font-black leading-tight font-sans tracking-tight text-zinc-800 text-center dark:text-zinc-100 sm:text-5xl">
          Hey <span className="not-italic">👋</span>, I&apos;m{" "}
          <span className="underline decoration-4 decoration-teal-600">
            Nick
          </span>
          .
        </h1>
        <p className="mt-6 mb-6 text-base text-center text-zinc-600 dark:text-zinc-400">
          Welcome to my little slice of the internet! This is the perfect place
          for me to share my experiences in software engineering and insights
          into my passions. Whether I&apos;m writing, speaking, or tinkering
          with my latest open-source or home automation project, I&apos;m always
          exploring new ways to challenge myself and push the boundaries of
          what&apos;s possible. Thanks for stopping by, and I hope you find
          something useful here.
        </p>
        <div className="flex justify-center">
          <div className="rounded-full bg-nord-500 dark:bg-nord-700 p-2">
            <div
              className="rounded-full w-40 h-40 bg-cover"
              style={{ backgroundImage: "url(/images/me.jpg)" }}
            ></div>
          </div>
        </div>
        <div className="mt-6 flex gap-6 justify-center">
          <a
            className="group -m-1 p-1"
            href={twitterUrl}
            aria-label="Follow on Twitter"
          >
            <TwitterIcon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
          </a>
          <a
            className="group -m-1 p-1"
            href={githubUrl}
            aria-label="Follow on GitHub"
          >
            <GitHubIcon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
          </a>
          <a
            className="group -m-1 p-1"
            href={linkedinUrl}
            aria-label="Follow on LinkedIn"
          >
            <LinkedInIcon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
          </a>
        </div>
      </div>
    </div>
  </Container>
)

export { Greeting }
