import type { ComponentPropsWithoutRef } from "react"
import { Card } from "@/components/Card"
import { Section } from "@/components/Uses/Section"
import type { SectionProps } from "@/components/Uses/Section"

export function ToolsSection({ children, ...props }: SectionProps) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

type ToolProps = {
  title: string
  href?: string
} & ComponentPropsWithoutRef<"div">

export function Tool({ title, href, children }: ToolProps) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}
