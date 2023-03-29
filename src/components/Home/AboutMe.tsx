import React from "react"

import { HeadingTwo, Paragraph } from "../Typography"

export const AboutMe = () => (
  <section>
    <div className="flex justify-center">
      <div className="rounded-full bg-nord-500 dark:bg-nord-700 p-2">
        <div
          className="rounded-full w-40 h-40 bg-cover"
          style={{ backgroundImage: "url(/images/profile-2.jpg)" }}
        ></div>
      </div>
    </div>
    <div className="bg-nord-500 dark:bg-nord-700 w-full shadow-inner -mt-16">
      <div className="max-w-5xl py-24 mx-auto text-center">
        <HeadingTwo className="text-nord-50 text-2xl">About Me</HeadingTwo>
        <Paragraph className="text-nord-50 px-4">
          I&apos;m an enthusiastic and passionate software engineer with over 9
          years of experience. I&apos;m fond of all things web and always
          striving to build user friendly, scalable and stable web solutions
          that get users engaged. Trained in the dark arts of full stack
          development I have gained experience in a broad range of technologies
          and languages. Eventually I hope to pursue a role where I can have a
          high impact on the product. In my spare time I like to hack on open
          source or personal projects, read books or watch a good movie.
        </Paragraph>
      </div>
    </div>
  </section>
)
