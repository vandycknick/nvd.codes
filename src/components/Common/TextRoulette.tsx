import React, { AnimationEvent, MouseEvent } from "react"
import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"

const roulette = keyframes`
0% {
    top: 0px
}

8% {
    top: 0px
}

10% {
    top: -40px
}

18% {
    top: -40px
}

20% {
    top: -80px
}

28% {
    top: -80px
}

30% {
    top: -120px
}

38% {
    top: -120px
}

40% {
    top: -160px
}

48% {
    top: -160px
}

50% {
    top: -200px
}

72% {
    top: -200px
}

78% {
    top: 0px
}

100% {
    top: 0px
}
`

const Roulette = styled.div`
  margin-bottom: 0px !important;
  vertical-align: bottom;
  display: inline-block;
  height: 40px;
  width: 100%;
  overflow: hidden;
  position: relative;

  ul {
    position: absolute;
    padding: 0;
    margin: 0;
    left: 0;
    list-style: none;
    width: 100%;
    animation: ${roulette} 12s ease 1500ms;
  }

  li {
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }
`

let animationName = ""

const onAnimationEnd = (event: AnimationEvent): void => {
  if (!animationName)
    animationName =
      window.getComputedStyle(event.target as Element).animationName || ""

  const li = event.target as HTMLLIElement
  li.style.animationName = "none"
}

const triggerAnimation = (event: MouseEvent<HTMLUListElement>): void => {
  const ul = event.currentTarget

  if (ul.style.animationName === "none") ul.style.animationName = animationName
}

interface TextRouletteProps {
  messages: string[]
  className?: string
}

const TextRoulette: React.FC<TextRouletteProps> = ({ messages, ...rest }) => (
  <Roulette {...rest}>
    <ul onClick={triggerAnimation} onAnimationEnd={onAnimationEnd}>
      {messages.map((m) => (
        <li key={m}>{m}</li>
      ))}
    </ul>
  </Roulette>
)

export default TextRoulette
