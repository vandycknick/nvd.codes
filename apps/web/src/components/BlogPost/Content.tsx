import React, { ElementType, ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import {
  Box,
  Text,
  Code,
  Divider,
  Link,
  List,
  Checkbox,
  ListItem,
  Heading,
} from "@chakra-ui/react"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism"

import { Image } from "components/Common/Image"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoreProps(props: any): any {
  return props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {}
}

type Props = { children?: ReactNode }

const Paragraph = ({ children }: Props) => <Text pb={4}>{children}</Text>

const Emphasis = ({ children }: Props) => <Text as="em">{children}</Text>

const Blockquote = ({ children }: Props) => (
  <Text
    as="blockquote"
    py={2}
    pl={4}
    my={4}
    borderLeftColor="teal.500"
    borderLeftWidth="4px"
    borderLeftStyle="solid"
    fontStyle="italic"
    className="no-padding"
  >
    {children}
  </Text>
)

const CodeBlock = (
  props: Props & { language?: string; value: string; node: { meta?: string } },
) => {
  const { value, language } = props
  let showLineNumbers = false

  try {
    const meta = JSON.parse(props.node.meta ?? "")
    showLineNumbers = meta?.numberLines ?? false
  } catch {
    // Ignored
  }

  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      language={language}
      style={dracula}
    >
      {value}
    </SyntaxHighlighter>
  )
}

const Delete = ({ children }: Props) => <Text as="del">{children}</Text>

const Span = ({ children }: Props) => <Text as="span">{children}</Text>

const ListElement = (
  props: Props & { start: number; ordered: boolean; depth: number },
) => {
  const { start, ordered, children, depth } = props
  const attrs = getCoreProps(props)
  if (start !== null && start !== 1 && start !== undefined) {
    attrs.start = start.toString()
  }
  let styleType = "disc"
  if (ordered) styleType = "decimal"
  if (depth === 1) styleType = "circle"
  return (
    <List
      spacing={4}
      as={ordered ? "ol" : "ul"}
      styleType={styleType}
      pl={4}
      mt={1}
      ml={6}
      mb={4}
      {...attrs}
    >
      {children}
    </List>
  )
}

const ListItemElement = (props: Props & { checked: boolean }) => {
  const { children, checked } = props
  let checkbox = null
  if (checked !== null && checked !== undefined) {
    checkbox = (
      <Checkbox isChecked={checked} isReadOnly>
        {children}
      </Checkbox>
    )
  }
  return (
    <ListItem
      {...getCoreProps(props)}
      listStyleType={checked !== null ? "none" : "inherit"}
    >
      {checkbox || children}
    </ListItem>
  )
}

const HeadingElement = (props: Props & { level: number }) => {
  const { level, children } = props
  const sizes = ["2xl", "xl", "lg", "md", "sm", "xs"]
  return (
    <Heading
      my={4}
      as={`h${level}`}
      size={sizes[level - 1]}
      {...getCoreProps(props)}
    >
      {children}
    </Heading>
  )
}

const InlineCode = (props: Props) => {
  const { children } = props
  return <Code {...getCoreProps(props)}>{children}</Code>
}

const ImageElement = (props: Props & { src: string; alt: string }) => {
  const { src, alt } = props
  return (
    <Box w="100%" textAlign="center">
      <Image objectFit="contain" src={src} alt={alt} width={750} height={500} />
    </Box>
  )
}

const renderers: { [nodeType: string]: ElementType } = {
  paragraph: Paragraph,
  emphasis: Emphasis,
  blockquote: Blockquote,
  code: CodeBlock,
  delete: Delete,
  thematicBreak: Divider,
  link: Link,
  image: ImageElement,
  linkReference: Link,
  imageReference: ImageElement,
  text: Span,
  list: ListElement,
  listItem: ListItemElement,
  definition: () => null,
  heading: HeadingElement,
  inlineCode: InlineCode,
}

type ContentsProps = {
  children: string
}

const Contents = ({ children }: ContentsProps) => (
  <ReactMarkdown renderers={renderers}>{children}</ReactMarkdown>
)

export { Contents }
