import { TwitterIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons"

type GreetingProps = {
  githubUrl: string
  twitterUrl: string
  linkedinUrl: string
}

const Greeting = ({ githubUrl, twitterUrl, linkedinUrl }: GreetingProps) => (
  <section className="relative mx-auto max-w-7xl px-8 h-full min-h-screen flex justify-center items-center">
    <div className="max-w-2xl mt-[-60px]">
      <h1 className="text-4xl text-center font-bold  tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl mb-6">
        {" "}
        Hi, I'm<span className="not-italic">👋</span> Nick!
      </h1>
      <div className="flex justify-center">
        <div className="rounded-full bg-nord-500 dark:bg-nord-700 p-2">
          <div
            className="rounded-full w-40 h-40 bg-cover ring-2 ring-teal-950 dark:ring-teal-900"
            style={{ backgroundImage: "url(/images/me.jpg)" }}
          ></div>
        </div>
      </div>
      <p className="mt-6 mb-6 text-base text-center text-black dark:text-white max-w-md">
        Hi, I’m a Lead Site Reliability Engineer based in Belgium, sharing
        thoughts on DevOps, system design, reliability and software development.
        I also tinker with home automation in my spare time. Let’s connect if
        you’re into resilient systems or just love cool tech.
      </p>
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
  </section>
)

export { Greeting }
