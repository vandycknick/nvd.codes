import React, { Fragment } from "react"
import { Avatar, Heading, Text, VStack } from "@chakra-ui/react"

import SEO from "components/Common/SEO"
import { LinkButton } from "components/Common/Buttons"

const About = () => (
  <Fragment>
    <SEO title="About" />
    <VStack as="section" justify="center">
      <Heading size="xl" pb={4}>
        About Me
      </Heading>
      <Heading as="h3" size="md" pb={4} color="gray.400" fontWeight="normal">
        Fun facts and the story behind my digital journey
      </Heading>
      <Avatar
        size="2xl"
        name="Nick Van Dyck"
        src="https://nvd.codes/profile.png"
        bg="teal.500"
      />
      <Text align="center" maxWidth="700px" py={6}>
        I’m an enthusiastic and passionate software engineer with over 6 years
        of experience. I&#39;m fond of all things web and always striving to
        build user friendly, scalable and stable web solutions that get users
        engaged. Trained in the dark arts of full stack development I have
        gained experience in a broad range of technologies and languages.
        Eventually I hope to pursue a role where I can have a high impact on the
        product. In my spare time I like to hack on open source or personal
        projects, read books or watch a good movie.
      </Text>
      <LinkButton href="https://resume.nvd.codes/resume.pdf">
        Resume 👨‍🎓
      </LinkButton>
    </VStack>
  </Fragment>
)

export default About
