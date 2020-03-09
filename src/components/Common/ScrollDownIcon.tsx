import React from "react"
import { css, keyframes } from "styled-components"
import { FaAngleDown } from "react-icons/fa"

const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-5px);
    }
`

const styles = css`
  animation: ${bounce} 3s infinite;

  &:hover {
    cursor: pointer;
  }
`

const scrollToBottom = (): void =>
  window.scrollTo(0, document.body.scrollHeight)

const ScrollDownIcon: React.FC = () => (
  <FaAngleDown css={styles} onClick={scrollToBottom} />
)

export default ScrollDownIcon
