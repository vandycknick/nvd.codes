import { Container } from "@/components/Container"
import { SocialLink } from "@/components/About/SocialLink"
import { Resume } from "@/components/About/Resume"
import { TwitterIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons"
import { MailOpenIcon } from "lucide-react"

export function About() {
  return (
    <Container className="pt-16 sm:pt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <img
              src="/images/profile.jpg"
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="grayscale aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            I&apos;m Nick Van Dyck. A Software Engineer working out of Belgium.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              My passion for programming started at a young age and has only
              grown stronger over the years. I hold a degree in Applied Computer
              Sciences and have had the opportunity to work with a variety of
              companies, continuously developing my skills as a Software
              Engineer.
            </p>
            <p>
              I began my career as a contractor during the early days of
              single-page application development. I worked closely with clients
              to build engaging, reactive frontends and helped them navigate
              this new era of web development. This gave me a solid foundation
              in delivering incremental value while learning the broader
              dynamics of building for the web.
            </p>
            <p>
              In 2015, I moved to London to join Marks and Spencer. There, I
              worked with a team using Python and Flask to build a new platform
              that consistently improved sales year after year. It was a
              rewarding experience that reinforced the value of working with
              diverse teams and delivering software that makes a tangible
              impact.
            </p>
            <p>
              After that, I joined MOO, where I helped build a new application
              for designers to create custom print products. We followed a
              test-driven approach and strong CI/CD practices, shipping features
              to customers daily. I also led the development of a shared design
              and component library that sped up UI development and reduced
              duplication across teams.
            </p>
            <p>
              I later moved into a DevOps and Infrastructure role at DataCamp,
              where I focused on improving security and building internal
              tooling to support developer productivity. One of my key
              contributions was delivering a self-serve portal that allowed
              developers to spin up new applications with a single click—fully
              equipped with secure defaults, deployment pipelines, monitoring,
              and logging. I also managed the infrastructure behind the learning
              platform and DataCamp Studio, enabling students to launch
              interactive development and learning environments directly in the
              browser.
            </p>
            <p>
              Currently, I work at Intigriti, a bug bounty and security platform
              that connects ethical hackers with companies to identify and fix
              vulnerabilities. As Lead Site Reliability Engineer, I focus on
              building secure, resilient systems that help keep our platform
              running smoothly.
            </p>
            <p>
              Outside of work, I enjoy tinkering with home automation and
              spending time with my family. If you'd like to get in touch or
              chat about building great software, feel free to reach out at
              info@nvd.sh — always happy to connect.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list" className="pb-20">
            <SocialLink
              href="https://twitter.com/vandycknick"
              icon={TwitterIcon}
            >
              Follow on Twitter
            </SocialLink>
            <SocialLink
              href="https://github.com/vandycknick"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/nickvandyck/"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:info@nvd.sh"
              icon={MailOpenIcon}
              fill="fill-zinc-100 dark:fill-zinc-500"
              stroke="stroke-zinc-400  dark:stroke-zinc-700"
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              info@nvd.sh
            </SocialLink>
          </ul>
          <Resume />
        </div>
      </div>
    </Container>
  )
}
