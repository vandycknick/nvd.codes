import React, { createContext, ReactNode, useContext } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import gfm from "remark-gfm"
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism"

nord['pre[class*="language-"]']["background"] = "none"

import { ImageWithPlaceholder } from "components/Common/Image"
import { ExternalLinkIcon } from "components/Common/Icons"

type ImageData = {
  placeholder: string
  width: number
  height: number
}
const ContentsContext = createContext<Record<string, ImageData>>({})

type Props = { children?: ReactNode[]; className?: string }

const CodeComponent = ({
  className,
  inline,
  children,
}: Props & { inline?: boolean }) => {
  if (inline) {
    return <code className="not-prose">{children}</code>
  }

  const language = className?.split("language-")[1] ?? "text"

  return (
    <div className="not-prose font-mono">
      <SyntaxHighlighter
        // showLineNumbers={showLineNumbers}
        language={language}
        style={nord}
      >
        {children}
      </SyntaxHighlighter>
    </div>
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

const components: Components = {
  code: CodeComponent,

  pre({ children }) {
    return <pre className="not-prose p-0">{children}</pre>
  },

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
}

type ContentsProps = {
  children: string
  images: Record<string, ImageData>
}

const Contents = ({ children, images }: ContentsProps) => (
  <ContentsContext.Provider value={images}>
    <ReactMarkdown components={components} remarkPlugins={[gfm]}>
      {children}
    </ReactMarkdown>
  </ContentsContext.Provider>
)

export { Contents }
