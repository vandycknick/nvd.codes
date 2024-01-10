import type { ComponentPropsWithoutRef, ElementType } from "react"
import clsx from "clsx"

type ContainerProps = {
  as?: ElementType
} & ComponentPropsWithoutRef<"div">

function OuterContainer({ className, children, as, ...props }: ContainerProps) {
  const Component = as ?? "div"
  return (
    <Component className={clsx("sm:px-8", className)} {...props}>
      <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
    </Component>
  )
}

const InnerContainer = function InnerContainer({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={clsx("relative px-4 sm:px-8 lg:px-12", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  )
}

export const Container = function Container({
  children,
  ...props
}: ContainerProps) {
  return (
    <OuterContainer {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  )
}

Container.Outer = OuterContainer
Container.Inner = InnerContainer
