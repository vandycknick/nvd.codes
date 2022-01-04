import React from "react"

import { HeadingTwo, Paragraph } from "components/Common/Typography"

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
    <div
      className="bg-nord-500 dark:bg-nord-700 w-full shadow-inner -mt-16"
      // style={{ backgroundImage: "url(/circuit-board.svg)" }}
    >
      <div className="max-w-5xl py-24 mx-auto text-center">
        <HeadingTwo className="text-nord-50 text-2xl">About Me</HeadingTwo>
        <Paragraph className="text-nord-50 px-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper
          nulla nunc quis molestie volutpat elementum at. Ultrices ipsum, enim
          cursus lorem ac. Orci maecenas praesent arcu eget orci est orci
          nullam. Leo purus est pellentesque massa at tortor, est. Aliquet
          pulvinar a mattis sagittis. Suspendisse porta id elementum, massa.
        </Paragraph>
      </div>
    </div>
  </section>
)
