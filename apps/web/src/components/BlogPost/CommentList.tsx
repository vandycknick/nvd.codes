import React from "react"
import useSWR from "swr"
import { PostComments } from "@nvd.codes/core"
import * as timeago from "timeago.js"
import {
  Box,
  Flex,
  List,
  ListItem,
  Image,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react"

import { fetchJSON } from "utils/async"
import { LinkButton } from "components/Common/Buttons"

type CommentListProps = {
  slug: string
}

const arrowStyles = {
  position: "absolute",
  top: "11px",
  right: "100%",
  left: "-16px",
  display: ["none", "block"],
  width: 0,
  height: 0,
  pointerEvents: "none",
  content: '" "',
  borderColor: "transparent",
  borderStyle: "solid solid outset",
}

const WriteComment = ({ editUrl }: { editUrl?: string }) => {
  const main = useColorModeValue("gray.100", "gray.700")
  const accent = useColorModeValue("white", "gray.800")
  const border = useColorModeValue("gray.300", "gray.300")
  return (
    <Flex py={4}>
      <Image
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNiIgdmVyc2lvbj0iMS4xIj48cGF0aCBmaWxsPSJyZ2IoMTc5LDE3OSwxNzkpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDEwLjVMOSAxNEg1bDEtMy41TDUuMjUgOWgzLjVMOCAxMC41ek0xMCA2SDRMMiA3aDEwbC0yLTF6TTkgMkw3IDMgNSAyIDQgNWg2TDkgMnptNC4wMyA3Ljc1TDEwIDlsMSAyLTIgM2gzLjIyYy40NSAwIC44Ni0uMzEuOTctLjc1bC41Ni0yLjI4Yy4xNC0uNTMtLjE5LTEuMDgtLjcyLTEuMjJ6TTQgOWwtMy4wMy43NWMtLjUzLjE0LS44Ni42OS0uNzIgMS4yMmwuNTYgMi4yOGMuMTEuNDQuNTIuNzUuOTcuNzVINWwtMi0zIDEtMnoiPjwvcGF0aD48L3N2Zz4="
        width={10}
        height={10}
        backgroundColor={main}
        borderRadius="full"
        mr={4}
        alt="@anonymous"
        display={["none", "block"]}
      />
      <Box
        position="relative"
        borderColor={border}
        borderStyle="solid"
        borderWidth="1px"
        borderRadius="md"
        flex="1 1 auto"
        _before={{
          ...arrowStyles,
          borderWidth: "8px",
          borderRightColor: border,
        }}
        _after={arrowStyles}
      >
        <Box
          as="header"
          borderBottomColor={border}
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          borderTopRadius="md"
          pt={2}
          px={4}
          pb={0}
          backgroundColor={main}
          fontSize="sm"
        >
          <Box marginBottom="-1px" background="transparent">
            <Text
              display="inline-block"
              py={2}
              px={4}
              background={accent}
              borderWidth="1px"
              borderStyle="solid"
              borderColor={border}
              borderBottom="0"
              borderTopRadius="md"
              _hover={{ cursor: "pointer" }}
            >
              Write
            </Text>
            <Text
              display="inline-block"
              py={2}
              px={4}
              _hover={{ cursor: "pointer" }}
            >
              Preview
            </Text>
          </Box>
        </Box>
        <Box padding={4}>
          <Textarea
            placeholder="Sign in to comment"
            aria-label="comment"
            disabled
            background={main}
            color="white"
            p={4}
            width="100%"
            minHeight="90px"
            borderWidth="1px"
            borderStyle="solid"
            borderRadius="md"
            display="block"
            resize="vertical"
            appearance="none"
            _disabled={{ cursor: "not-allowed" }}
          />
        </Box>
        <Flex as="footer" justifyContent="flex-end" pt={0} px={4} pb={4}>
          <LinkButton
            href={editUrl}
            fontSize="sm"
            target="_blank"
            disabled={editUrl == undefined || editUrl === ""}
          >
            Open Github
          </LinkButton>
        </Flex>
      </Box>
    </Flex>
  )
}

export const CommentList: React.FC<CommentListProps> = ({ slug }) => {
  const { data, error } = useSWR<PostComments>(
    `${process.env.NEXT_PUBLIC_COMMENTS_API}/api/comments/${slug}`,
    fetchJSON,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { shouldRetryOnError: false, onErrorRetry: () => {} },
  )

  if (data == undefined && error == undefined) {
    return (
      <Box maxWidth="750px" width="100%" margin="0 auto" pb={4}>
        <Flex justifyContent="center" alignItems="center" padding={6}>
          Loading comments...
        </Flex>
        <WriteComment />
      </Box>
    )
  }

  if (error != undefined) {
    return (
      <Box maxWidth="750px" width="100%" margin="0 auto" pb={4}>
        <Flex justifyContent="center" alignItems="center" padding={6}>
          Oh no, something went wrong trying to load comments for this post.
        </Flex>
        <WriteComment />
      </Box>
    )
  }

  return (
    <Box maxWidth="750px" width="100%" margin="0 auto" pb={4}>
      {data?.totalComments === 0 && <Text fontWeight="bold">0 Comments</Text>}
      {(data?.totalComments ?? 0) > 0 && (
        <List m={0} py={4} px={0}>
          {data?.comments.map((comment) => (
            <ListItem key={comment.id} px={4} py={0}>
              <Image
                src={comment.author.avatarUrl}
                width={40}
                height={40}
                display="none"
                pb={4}
              />
              <Box
                position="relative"
                borderColor="gray.300"
                borderStyle="solid"
                borderWidth="1px"
                borderRadius="sm"
                flex="1 1 auto"
                _before={{
                  ...arrowStyles,
                  borderWidth: "8px",
                  borderRightColor: "gray.300",
                }}
                _after={arrowStyles}
              >
                <div
                // className={css`
                //   background-color: ${colors.grey[800]};
                //   border-bottom: 1px solid ${colors.grey[300]};
                //   padding: ${spacing[2]} ${spacing[4]};
                //   font-size: ${fontSize.sm};
                // `}
                >
                  <a
                    href={`https://github.com/${comment.author.login}`}
                    // className={css`
                    //   color: ${theme.onBackground};
                    //   font-weight: ${fontWeight.bold};
                    //   text-decoration: none;

                    //   &:hover {
                    //     text-decoration: underline;
                    //   }
                    // `}
                  >
                    {comment.author.login}
                  </a>
                  {" commented "}
                  <Text>{timeago.format(comment.createdAt)}</Text>
                </div>
                <Box
                  py={2}
                  px={4}
                  dangerouslySetInnerHTML={{ __html: comment.body }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      )}
      <WriteComment editUrl={data?.url} />
    </Box>
  )
}
