import React from "react"

import SEO from "components/Common/SEO"
import {
  HeadingOne,
  HeadingThree,
  HeadingFour,
} from "components/Common/Typography"

const About = () => (
  <>
    <SEO title="About" />
    <div className="max-w-6xl w-full flex flex-col flex-1 mx-auto px-4 xl:px-0 py-14">
      <HeadingOne>About Me</HeadingOne>
      <div className="flex">
        <div
          style={{ backgroundImage: "url(/images/profile.png)" }}
          className="h-16 w-16 bg-cover bg-center  rounded-full mr-4"
        />
        <div className="flex flex-col">
          <HeadingThree> Nick Van Dyck</HeadingThree>
          <HeadingFour>Software Engineer</HeadingFour>
        </div>
      </div>
    </div>
  </>
)

export default About
