import React, { Fragment, useRef, useEffect, memo } from "react"
import { Text, TextProps, useControllableState } from "@chakra-ui/react"
import { motion, useAnimation } from "framer-motion"

type Arg = string | number | TypeFunction
type TypeFunction = (node: HTMLElement, ...args: Arg[]) => Promise<void>

export async function type(node: HTMLElement | null, ...args: Arg[]) {
  if (node === null) return

  for (const arg of args) {
    switch (typeof arg) {
      case "string":
        await edit(node, arg)
        break
      case "number":
        await wait(arg)
        break
      case "function":
        await arg(node, ...args)
        break
      default:
        await arg
    }
  }
}

async function edit(node: HTMLElement, text: string) {
  const overlap = getOverlap(node.textContent ?? "", text)
  await perform(node, [
    ...deleter(node.textContent ?? "", overlap),
    ...writer(text, overlap),
  ])
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function perform(node: HTMLElement, edits: string[], speed = 60) {
  for (const op of editor(edits)) {
    op(node)
    await wait(speed + speed * (Math.random() - 0.5))
  }
}

export function* editor(edits: string[]) {
  for (const edit of edits) {
    yield (node: HTMLElement) =>
      requestAnimationFrame(() => (node.textContent = edit))
  }
}

export function* writer(
  [...text]: string,
  startIndex = 0,
  endIndex = text.length,
) {
  while (startIndex < endIndex) {
    yield text.slice(0, ++startIndex).join("")
  }
}

export function* deleter(
  [...text]: string,
  startIndex = 0,
  endIndex = text.length,
) {
  while (endIndex > startIndex) {
    yield text.slice(0, --endIndex).join("")
  }
}

export function getOverlap(start: string, [...end]: string) {
  return [...start, NaN].findIndex((char, i) => end[i] !== char)
}

type TypeWriterProps = {
  steps: (string | number)[]
  loop: number
  as?: TextProps["as"]
}

const TypeWriter = ({ steps, loop }: TypeWriterProps) => {
  const nodeRef = useRef(null)
  const controls = useAnimation()
  controls.start({ opacity: [1, 0.25, 1] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    controls.stop()
    if (loop === Infinity) {
      type(nodeRef.current, ...steps, type).then(() =>
        controls.start({ opacity: [1, 0.25, 1] }),
      )
    } else if (typeof loop === "number") {
      type(nodeRef.current, ...Array(loop).fill(steps).flat()).then(() =>
        controls.start({ opacity: [1, 0.25, 1] }),
      )
    } else {
      type(nodeRef.current, ...steps).then(() =>
        controls.start({ opacity: [1, 0.25, 1] }),
      )
    }
  })

  return (
    <Fragment>
      <Text ref={nodeRef} pr={1} />
      <Text as="span" fontWeight="bolder" lineHeight={1}>
        <motion.span
          animate={controls}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          |
        </motion.span>
      </Text>
    </Fragment>
  )
}

export default memo(TypeWriter)
