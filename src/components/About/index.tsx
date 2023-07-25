import { Container } from "@/components/Container"
import { SocialLink } from "@/components/About/SocialLink"
import { Resume } from "@/components/About/Resume"
import {
  TwitterIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/Icons"

export function About() {
  return (
    <Container className="mt-16 sm:mt-32">
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
              Sciences and have been fortunate enough to work for a diverse
              range of companies, honing my skills as a Software Engineer.
            </p>
            <p>
              I started my career as a contractor in the early days of SPA web
              development. I helped clients navigate these newfound waters by
              building enticing reactive frontends. This experience helped me
              gain better understand of the ins and outs of web development, all
              while learning how to deliver small incremental value to
              customers.
            </p>
            <p>
              In 2015, I relocated to London to join the team at Marks and
              Spencer. Using Python and Flask, our team delivered a brand new
              platform that resulted in a significant uplift in sales year after
              year. It was an incredible experience, demonstrating my ability to
              deliver high-quality software while working with a diverse range
              of people and cultures.
            </p>
            <p>
              Following that, I worked at MOO as part of a small team building a
              new application focused on enabling professional and hobbyist
              designers to create astonishing print products. Using a
              test-driven first approach and good CI/CD practices, we delivered
              new features to customers daily. Additionally, I led the creation
              of a shared design, style, and component library that enabled
              faster delivery of UI features and reduced duplication across the
              company.
            </p>
            <p>
              Currently, I work at DataCamp, an online learning platform
              teaching data science, where I transitioned into a
              DevOps/Infrastructure engineering role. Here, I gained experience
              building scalable, reliable, and secure infrastructure to support
              the needs of a rapidly growing business. Throughout my career,
              I&apos;ve demonstrated a strong passion for software engineering
              and a commitment to delivering high-quality products that meet
              customer needs. I&apos;m an excellent collaborator and a quick
              learner, always eager to tackle new challenges and stay up-to-date
              with the latest technologies.
            </p>
            <p>
              When not working on software projects, I enjoy tinkering with my
              home automation systems and spending time with my family. If
              you&apos;re interested in learning more about my experiences or
              exploring opportunities for building great software together, give
              me a shout at info@nvd.codes. I&apos;m always happy to chat, so
              feel free to reach out!
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
              href="mailto:info@nvd.codes"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              info@nvd.codes
            </SocialLink>
          </ul>
          <Resume />
        </div>
      </div>
    </Container>
  )
}
