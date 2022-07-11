import React, { createContext, ReactNode, useContext } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import gfm from "remark-gfm"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism"

// nord['pre[class*="language-"]']["background"] = "none"
nord['pre[class*="language-"]']["paddingBottom"] = "0"

import { ImageWithPlaceholder } from "components/Common/Image"
import { ExternalLinkIcon } from "components/Common/Icons"

type ImageData = {
  placeholder: string
  width: number
  height: number
}
const ContentsContext = createContext<Record<string, ImageData>>({})

type Props = { children?: ReactNode[]; className?: string }

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export const Heading = ({
  level,
  id,
  children,
  className,
}: Props & { level: number; id: string }) => {
  const Component = `h${level ?? 1}` as HeadingTag
  return (
    <Component className={["not-prose", className].filter(Boolean).join(" ")}>
      <a
        className="no-underline hover:opacity-100 after:bottom-0 after:right-0 after:opacity-0 after:content-['#'] hover:after:opacity-100 after:transition-opacity after:transition-opacity after:pl-2 after:text-frost-300 after:text-xl after:inline-block"
        href={`#${id}`}
      >
        <div id={id} />
        {children}
      </a>
    </Component>
  )
}

export const Image = ({
  src,
  alt,
  placeholder,
  width,
  height,
}: Props & {
  src: string
  alt: string
  placeholder: string
  width: number
  height: number
}) => {
  return (
    <ImageWithPlaceholder
      src={src}
      alt={alt}
      width={width}
      height={height}
      placeholder={placeholder}
    />
  )
}

export const components = {
  Heading,
  Image,
}

const CodeComponent = ({
  className,
  inline,
  children,
}: Props & { inline?: boolean }) => {
  if (inline) {
    return <code>{children}</code>
  }

  const language = className?.split("language-")[1] ?? "text"

  return (
    <SyntaxHighlighter
      // showLineNumbers={showLineNumbers}
      language={language}
      style={nord}
    >
      {children as unknown as string}
    </SyntaxHighlighter>
  )
}

const LinkComponent = ({ children, href }: Props & { href: string }) => (
  <a href={href} rel="noopener noreferrer">
    {children} <ExternalLinkIcon className="mx-1 h-5 w-5" />
  </a>
)

const ImageComponent = (props: Props & { src: string; alt: string }) => {
  const images = useContext(ContentsContext)
  const { src, alt } = props
  const img = images[src]

  return (
    <ImageWithPlaceholder
      src={src}
      alt={alt}
      width={img.width}
      height={img.height}
      placeholder={img.placeholder}
    />
  )
}
