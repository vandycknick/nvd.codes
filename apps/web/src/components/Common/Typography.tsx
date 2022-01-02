import React from "react"
import cx from "classnames"

type TypographyProps = {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
}

type HeadingProps = TypographyProps

export const HeadingOne = ({ as, children, className }: HeadingProps) => {
  const Component = as ?? "h1"
  return (
    <Component
      className={cx(
        "text-5xl font-black text-nord-600 leading-tight font-sans dark:text-nord-100 italic pb-6",
        className,
      )}
    >
      {children}
    </Component>
  )
}

export const HeadingTwo = ({ as, children, className }: HeadingProps) => {
  const Component = as ?? "h2"
  return (
    <Component
      className={cx(
        "text-4xl font-extrabold text-nord-600 leading-tight font-sans dark:text-nord-100 leading-normal pb-2",
        className,
      )}
    >
      {children}
    </Component>
  )
}

export const HeadingThree = ({ as, children }: HeadingProps) => {
  const Component = as ?? "h3"
  return (
    <Component className="text-3xl font-extrabold text-nord-600 leading-tight font-sans dark:text-nord-100 leading-normal pb-2">
      {children}
    </Component>
  )
}

export const HeadingFour = ({ as, children }: HeadingProps) => {
  const Component = as ?? "h3"
  return (
    <Component className="text-xl font-extrabold text-nord-600 leading-tight font-sans dark:text-nord-100 leading-normal pb-2">
      {children}
    </Component>
  )
}

export const HeadingSix = ({ as, children }: HeadingProps) => {
  const Component = as ?? "h6"
  return (
    <Component className="text-md font-bold text-nord-600 leading-tight font-sans dark:text-nord-100 leading-normal pb-2">
      {children}
    </Component>
  )
}

export const Paragraph = ({ as, children, className }: TypographyProps) => {
  const Component = as ?? "p"
  return (
    <Component
      className={cx("text-nord-600 dark:text-nord-100 font-normal", className)}
    >
      {children}
    </Component>
  )
}

export const Text = ({ as, children, className }: TypographyProps) => {
  const Component = as ?? "span"
  return (
    <Component className={cx("text-nord-600 dark:text-nord-100", className)}>
      {children}
    </Component>
  )
}
