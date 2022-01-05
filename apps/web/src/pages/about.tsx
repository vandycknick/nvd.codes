import React from "react"

import SEO from "components/Common/SEO"
import {
  HeadingFive,
  HeadingFour,
  HeadingOne,
  HeadingThree,
  Paragraph,
  Text,
} from "components/Common/Typography"

const work = [
  {
    name: "DataCamp",
    position: "DevOps Engineer",
    time: "2019 - now",
    summary:
      "Currently working at DataCamp helping to improve data literacy around the globe.",
  },
  {
    name: "MOO",
    position: "Senior Software Engineer",
    time: "2017 - 2019",
    summary:
      "At MOO I was part of a small team that got tasked to build a new application focussed on professional and hobbyist designers to enable them to create astonishing print products. In its essence this was an upload experience that guided customers through the process of putting their custom design on a card and get a high quality product shipped right to their door step. I worked in an agile team focussed both on frontend and backend. A test driven first methodology and good CI/CD practices allowed us to ship new features to our customers on a daily basis. I was also involved in a wider initiative to help create a shared design, style and component library. I kicked of the tires for a new react component library that helped teams deliver new UI features faster and reduce duplication across the company.",
  },
  {
    name: "Marks and Spencer",
    position: "Software Engineer",
    time: "2015 - 2017",
    summary:
      "I moved to London towards the end of 2015 to join the amazing team over at Marks and Spencer. During my time here I mainly work as part of a cross functional agile team building a brand new Christmas Food to Order platform. Build as a modern web application using Python, Flask, ... the platform was a success with an uplift in sale year on year.",
  },
  {
    name: "SDWorx",
    position: "Software Engineer",
    time: "2015",
    summary:
      "After working at SDWorx as a contractor for 3 years I decided to make the jump as an FTE at the beginning of 2015. During my time here I mainly worked with dotnet and helped them build enticing frontends in the early days of SPA development.",
  },
  {
    name: "TecIT",
    position: "Software Engineer / Analyst",
    time: "2012 - 2015",
    summary:
      "TecIT was my first foray into professional software development. As a contractor I learned the ins and outs of web development and delivering small incremental value to customers. I was responsible for building a number of online systems with the dotnet eco-system (SharePoint, C#, ASP.NET, SQL, ...).",
  },
]

const About = () => (
  <>
    <SEO title="About" />
    <div className="max-w-6xl w-full flex flex-col flex-1 mx-auto px-4 xl:px-0 py-14">
      <HeadingOne className="text-center">About Me</HeadingOne>
      <div className="flex pb-8">
        <div
          style={{ backgroundImage: "url(/images/profile-2.jpg)" }}
          className="h-20 w-20 bg-cover bg-center  rounded-full mr-4"
        />
        <div className="flex flex-col">
          <HeadingThree className="pb-0"> Nick Van Dyck</HeadingThree>
          <Text className="font-semibold text-nord-400">Software Engineer</Text>
        </div>
      </div>
      <article className="bg-nord-50 p-6 dark:bg-nord-700 rounded-lg w-full max-w-6xl drop-shadow-xl">
        <HeadingFour>Details</HeadingFour>
        <Paragraph className="pb-8">
          I&apos;m an enthusiastic and passionate software engineer with over 9
          years of experience. I&apos;m fond of all things web and always
          striving to build user friendly, scalable and stable web solutions
          that get users engaged. Trained in the dark arts of full stack
          development I have gained experience in a broad range of technologies
          and languages. Eventually I hope to pursue a role where I can have a
          high impact on the product. In my spare time I like to hack on open
          source or personal projects, read books or watch a good movie.
        </Paragraph>
        <HeadingFour>Timeline</HeadingFour>
        <div className="w-1/2 pt-4">
          {work.map((w, index) => (
            <div key={w.name} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border dark:border-nord-50 border-nord-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 stroke-nord-500 dark:stroke-nord-50"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {index < work.length - 1 ? (
                  <div className="w-px h-full bg-nord-500 dark:bg-nord-50"></div>
                ) : null}
              </div>
              <div className="pb-8 ">
                <div className="pb-2">
                  <HeadingFive className="pb-0">{w.name} </HeadingFive>
                  <Text className="block text-sm font-medium">
                    {w.position}
                  </Text>
                  <Text className="block text-sm font-normal">{w.time}</Text>
                </div>
                <Paragraph>{w.summary}</Paragraph>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  </>
)

export default About
