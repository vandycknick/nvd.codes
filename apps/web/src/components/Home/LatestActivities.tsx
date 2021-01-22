import React from "react"
import useSWR from "swr"
import * as timeago from "timeago.js"
import { Activity } from "@nvd.codes/core"
import {
  Box,
  Circle,
  Divider,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"

import { Commit as CommitIcon, RepositoryIcon } from "components/Home/Icons"
import { fetchJSON } from "utils/async"

// const cssFromBackgroundColor = (background: string): string => {
//   let color = background

//   if (color.length < 5) {
//     color += color.slice(1)
//   }
//   color =
//     parseInt(color.replace("#", "0x"), 16) > 0xffffff / 2 ? "#333" : "#fff"

//   return css`
//     background-color: ${background};
//     color: ${color};
//   `
// }

type ActivityCardProps = {
  date: string
  name: string
  heading: string
  message: string
  icon: React.ReactElement
}

const ActivityCard = ({
  date,
  name,
  heading,
  message,
  icon: Icon,
}: ActivityCardProps) => {
  const bg = useColorModeValue("transparent", "gray.700")
  const nameColor = useColorModeValue("gray.500", "gray.50")
  const messageColor = useColorModeValue("gray.600", "gray.100")
  return (
    <Flex direction="column" boxShadow="lg" borderRadius="md" bg={bg}>
      <Text p={4} textAlign="right" w="100%" color={nameColor} fontSize="sm">
        {timeago.format(date).toUpperCase()}
      </Text>
      <Flex w="100%" mt={0} mb={8} position="relative" alignItems="center">
        <Divider />
        <Circle
          size="40px"
          bg="teal.800"
          bgGradient="linear(to-br, green.600, cyan.700)"
          color="white"
          position="absolute"
          mx={8}
          p={1}
        >
          {Icon}
        </Circle>
      </Flex>
      <VStack px={8} pb={4} spacing={1} alignItems="left">
        <Text color={nameColor} fontSize="sm">{`in ${name}`}</Text>
        <Heading as="h5" size="md">
          {heading}
        </Heading>
        <Text color={messageColor} fontSize="sm" noOfLines={2}>
          {message}
        </Text>
      </VStack>
    </Flex>
  )
}

type OnlineActivityProps = {
  activity: Activity
}

const OnlineActivity: React.FC<OnlineActivityProps> = ({ activity }) => {
  const { latestCommit, projects } = activity
  return (
    <Grid
      as="section"
      templateColumns={[
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(2, 1fr)",
        "repeat(3, 1fr)",
      ]}
      gap={5}
    >
      <ActivityCard
        date={latestCommit.pushedDate}
        name={latestCommit.repositoryName}
        heading="Latest Commit"
        message={latestCommit.messageHeadline}
        icon={<CommitIcon width={6} height={6} />}
      />
      {projects.slice(0, 5).map((project) => (
        <ActivityCard
          key={project.id}
          date={project.updatedAt}
          name={project.nameWithOwner}
          heading={project.name}
          message={project.description}
          icon={<RepositoryIcon width={6} height={6} />}
        />
      ))}
    </Grid>
  )
}

type RenderOnlineActivity = {
  activity?: Activity
  error?: Error
}

const renderOnlineActivity = ({
  activity,
  error,
}: RenderOnlineActivity): React.ReactElement => {
  if (activity) {
    return <OnlineActivity activity={activity} />
  }

  if (error) {
    return <div />
  }

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal.500"
      size="md"
    />
  )
}

const LatestActivities = () => {
  const { data: activity, error } = useSWR<Activity>(
    `${process.env.NEXT_PUBLIC_PROJECTS_API}/api/project/activities`,
    fetchJSON,
  )
  return (
    <VStack spacing={4} py={8} mb={8} width="100%">
      <Heading as="h4" size="lg" py={4}>
        Online Activity
      </Heading>
      <Text pb={4}>
        I like playing around with code, here are is a list of the latest things
        I worked on in the open.
      </Text>
      <Box width="100%">{renderOnlineActivity({ activity, error })}</Box>
    </VStack>
  )
}

export { LatestActivities }
