import React from "react"
import {
  Button,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"

import { Globe } from "components/Home/Icons/Globe"
import { Github } from "components/Home/Icons/Github"
import { Twitter } from "components/Home/Icons/Twitter"
import TypeWriter from "components/Common/TypeWriter"

type GreetingProps = {
  githubUrl: string
  twitterUrl: string
  siteUrl: string
}

const Greeting: React.FC<GreetingProps> = ({
  githubUrl,
  twitterUrl,
  siteUrl,
}) => {
  const iconColor = useColorModeValue("black", "white")
  return (
    <VStack as="section" mb={4}>
      <Heading pt={6} fontWeight="normal">
        Hi 👋
      </Heading>
      <Heading as="h2" size="4xl" fontWeight="extrabold">
        I
        <Text
          as="span"
          bgGradient="linear(to-br, green.400, cyan.500)"
          bgClip="text"
        >
          &#39;
        </Text>
        m Nick
      </Heading>
      <Heading as="h3" size="md" pt="4" fontWeight="normal" display="flex">
        And I&#39;m a &nbsp;
        <TypeWriter
          steps={[
            250,
            "Develo",
            500,
            "Full Stack Engin",
            500,
            "DevOps Engineer",
            250,
            "Software",
            250,
            "Software Engineer",
          ]}
          loop={1}
        />
      </Heading>
      <Text py="4" maxW="500px" textAlign="center">
        I try to write code and blog about my experiences. Love writing,
        speaking, travelling or making lots of random stuff. Mostly I can be
        found playing around with Python, .NET, TypeScript or JavaScript.
        Occasionally developing CLI tools and apps.
      </Text>
      <HStack pt="4">
        <Button
          as="a"
          href={siteUrl}
          bg="transparent"
          leftIcon={<Globe width={5} height={5} color={iconColor} />}
        >
          Web
        </Button>
        <Button
          as="a"
          href={githubUrl}
          bg="transparent"
          leftIcon={<Github w={5} h={5} color={iconColor} />}
        >
          Github
        </Button>
        <Button
          as="a"
          href={twitterUrl}
          bg="transparent"
          leftIcon={<Twitter width={5} height={5} color={iconColor} />}
        >
          Twitter
        </Button>
      </HStack>
    </VStack>
  )
}

export { Greeting }
