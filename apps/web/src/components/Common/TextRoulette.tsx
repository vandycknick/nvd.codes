// import React, { useState, useCallback, ReactChild } from "react"
// import { css, keyframes } from "@emotion/css"
// import styled from "@emotion/styled"

// const roulette = keyframes`
// 0% {
//     top: 0px
// }

// 8% {
//     top: 0px
// }

// 10% {
//     top: -40px
// }

// 18% {
//     top: -40px
// }

// 20% {
//     top: -80px
// }

// 28% {
//     top: -80px
// }

// 30% {
//     top: -120px
// }

// 38% {
//     top: -120px
// }

// 40% {
//     top: -160px
// }

// 48% {
//     top: -160px
// }

// 50% {
//     top: -200px
// }

// 72% {
//     top: -200px
// }

// 78% {
//     top: 0px
// }

// 100% {
//     top: 0px
// }
// `

// type RouletteProps = {
//   spin: boolean
// }

// const Roulette = styled.div<RouletteProps>`
//   margin-bottom: 0px !important;
//   vertical-align: bottom;
//   display: inline-block;
//   height: 35px;
//   width: 200px;
//   overflow: hidden;
//   position: relative;

//   &:hover {
//     cursor: pointer;
//   }

//   ul {
//     position: absolute;
//     padding: 0;
//     margin: 0;
//     left: 0;
//     list-style: none;
//     width: 100%;

//     ${({ spin }) =>
//       spin &&
//       css`
//         animation-name: ${roulette};
//         animation-duration: 12s;
//         animation-direction: ease;
//         animation-fill-mode: 1500ms;
//       `}
//   }

//   li {
//     margin: 0;
//     padding: 0;
//     margin-bottom: 10px;
//     width: 100%;
//     height: 30px;
//     text-align: center;
//   }
// `
// interface TextRouletteProps {
//   messages: ReactChild[]
//   className?: string
// }

// const getKey = (child: ReactChild | null): string => {
//   if (child === null) {
//     return "null"
//   }

//   if (typeof child === "string") {
//     return child
//   }

//   if (typeof child === "number") {
//     return child.toString()
//   }

//   return getKey(child.key)
// }

// const TextRoulette: React.FC<TextRouletteProps> = ({ messages, className }) => {
//   const [spin, setSpin] = useState(true)
//   const startSpin = useCallback(() => setSpin(() => true), [])
//   const stopSpin = useCallback(() => setSpin(() => false), [])
//   return (
//     <Roulette className={className} spin={spin}>
//       <ul onClick={startSpin} onAnimationEnd={stopSpin}>
//         {messages.map((m) => (
//           <li key={getKey(m)}>{m}</li>
//         ))}
//       </ul>
//     </Roulette>
//   )
// }

// export { TextRoulette }
export const TextRoulette = {}
