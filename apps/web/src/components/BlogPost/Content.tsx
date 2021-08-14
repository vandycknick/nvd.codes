import React, { createContext, ReactNode, useContext } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import gfm from "remark-gfm"
import Image from "next/image"
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Text,
  Code,
  Divider,
  Link,
  List,
  Checkbox,
  ListItem,
  Heading,
} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism"

import { imageLoader } from "components/Common/Image"

const ContentsContext = createContext<Record<string, string>>({})

type Props = { children?: ReactNode[]; className?: string }

const ParagraphComponent = ({ children }: Props) => (
  <Text pb={4}>{children}</Text>
)

const EmphasisComponent = ({ children }: Props) => (
  <Text as="em">{children}</Text>
)

const BlockquoteComponent = ({ children }: Props) => (
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

const DeleteComponent = ({ children }: Props) => (
  <Text as="del">{children}</Text>
)

const SpanComponent = ({ children }: Props) => <Text as="span">{children}</Text>

const H1Component = ({ children }: Props) => (
  <Heading my={4} as="h1" size="2xl">
    {children}
  </Heading>
)
const H2Component = ({ children }: Props) => (
  <Heading my={4} as="h2" size="xl">
    {children}
  </Heading>
)

const H3Component = ({ children }: Props) => (
  <Heading my={4} as="h3" size="lg">
    {children}
  </Heading>
)

const H4Component = ({ children }: Props) => (
  <Heading my={4} as="h4" size="md">
    {children}
  </Heading>
)

const H5Component = ({ children }: Props) => (
  <Heading my={4} as="h5" size="sm">
    {children}
  </Heading>
)

const H6Component = ({ children }: Props) => (
  <Heading my={4} as="h6" size="xs">
    {children}
  </Heading>
)

const TableComponent = ({ children }: Props) => (
  <Table variant="simple" mb={10}>
    {children}
  </Table>
)

const CodeComponent = ({
  className,
  inline,
  children,
}: Props & { inline?: boolean }) => {
  if (inline) {
    return <Code>{children}</Code>
  }

  const language = className?.split("language-")[1] ?? "text"

  return (
    <Box mb={6}>
      <SyntaxHighlighter
        // showLineNumbers={showLineNumbers}
        language={language}
        style={dracula}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  )
}

const LinkComponent = ({ children, href }: Props & { href: string }) => (
  <Link
    colorScheme="teal"
    isExternal
    rel="noopener noreferrer"
    display="inline-flex"
    href={href}
  >
    {children} <ExternalLinkIcon mx="2px" mt="2px" />
  </Link>
)

const ImageComponent = (props: Props & { src: string; alt: string }) => {
  const images = useContext(ContentsContext)
  const { src, alt } = props
  const placeholder = images[src]
  return (
    <Box py="6" m="0 auto" maxW="800px">
      <Box position="relative">
        <Box
          css={{
            backgroundImage: `url('${placeholder}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            overflow: "hidden",
            position: "absolute",
            filter: "blur(10px)",
            transform: "scale(0.96)",
          }}
          w="100%"
          h="100%"
        />
        <Image
          layout="responsive"
          loader={imageLoader}
          loading="lazy"
          src={src}
          alt={alt}
          width={600}
          height={350}
        />
      </Box>
    </Box>
  )
}

const ListComponent = ({
  depth,
  ordered,
  children,
}: Props & { depth: number; ordered: boolean }) => {
  let styleType = "disc"
  if (ordered) styleType = "decimal"
  if (depth === 1) styleType = "circle"
  return (
    <List
      spacing={1}
      as={ordered ? "ol" : "ul"}
      styleType={styleType}
      pl={4}
      ml={6}
      mb={4}
    >
      {children}
    </List>
  )
}

const ListItemComponent = (props: Props & { checked: boolean | null }) => {
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
    <ListItem listStyleType={checked !== null ? "none" : "inherit"}>
      {checkbox || children}
    </ListItem>
  )
}

const components: Components = {
  p: ParagraphComponent,
  em: EmphasisComponent,
  blockquote: BlockquoteComponent,

  code: CodeComponent,

  del: DeleteComponent,
  hr: Divider,
  a({ href, children }) {
    if (typeof href === "string") {
      return <LinkComponent href={href}>{children}</LinkComponent>
    }
    return <></>
  },
  img(props) {
    const { src, alt } = props
    if (typeof src === "string" && typeof alt === "string") {
      return <ImageComponent src={src} alt={alt} {...props} />
    }
    return <></>
  },
  span: SpanComponent,
  ol: ListComponent,
  ul: ListComponent,
  li: ListItemComponent,
  h1: H1Component,
  h2: H2Component,
  h3: H3Component,
  h4: H4Component,
  h5: H5Component,
  h6: H6Component,
  table: TableComponent,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  // TODO: FIX ME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  td: Td as any,
}

type ContentsProps = {
  children: string
  images: Record<string, string>
}

const Contents = ({ children, images }: ContentsProps) => (
  <ContentsContext.Provider value={images}>
    <ReactMarkdown components={components} remarkPlugins={[gfm]}>
      {children}
    </ReactMarkdown>
  </ContentsContext.Provider>
)

export { Contents }
