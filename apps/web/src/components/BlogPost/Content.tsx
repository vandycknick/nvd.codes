import React, { ReactNode } from "react"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useTheme } from "../Common/ThemeProvider"

import { ImageWithPlaceholder } from "components/Common/Image"
// import { ExternalLinkIcon } from "components/Common/Icons"

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

const Fence = ({
  children,
  language,
}: {
  language?: string
  children: string
}) => {
  const { theme } = useTheme()
  let style = nord
  if (theme === "dark") {
    style['pre[class*="language-"]']["background"] = "#242933"
    style = {
      ...nord,
    }
  }

  return (
    <SyntaxHighlighter
      // showLineNumbers={showLineNumbers}
      language={language ?? ""}
      style={style}
    >
      {children}
    </SyntaxHighlighter>
  )
}

export const components = {
  Heading,
  Image,
  Fence,
}
