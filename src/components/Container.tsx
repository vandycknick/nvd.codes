import type { ComponentProps, PropsWithChildren } from "react"
import clsx from "clsx"

type Props<As extends React.ElementType = "div"> = {
  as?: As
} & ComponentProps<As> &
  PropsWithChildren

function OuterContainer<T extends React.ElementType = "div">({
  className,
  children,
  as,
}: Props<T>) {
  const Component = as ?? "div"
  return (
    <Component className={clsx("sm:px-8", className)}>
      <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
    </Component>
  )
}

const InnerContainer = function InnerContainer({
  className,
  children,
  ...props
}: Props<"div">) {
  return (
    <div
      className={clsx("relative px-4 sm:px-8 lg:px-12", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  )
}

export const Container = function Container({ children, ...props }: Props) {
  return (
    <OuterContainer {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  )
}

Container.Outer = OuterContainer
Container.Inner = InnerContainer
