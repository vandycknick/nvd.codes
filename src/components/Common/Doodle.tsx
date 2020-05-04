import React from "react"
import { css } from "@emotion/core"
import "css-doodle"

import { styled, colors } from "src/components/Tokens"

const DoodleWrapper = styled.div`
  ${({ theme }) =>
    css`
      display: flex;
      background-color: ${theme.background};
      height: 60px;
    `}
`

const Doodle: React.FC = () => (
  <DoodleWrapper>
    <css-doodle click-to-update>
      {`
          :doodle {
            @grid: 1x 60/100vw 10rem;
          }

          :hover {
            opacity: 1;
          }

          transition: opacity .2s ease-out;
          animation: slide-in .25s ease-out;
          opacity: @pick(0.3, 0.4, 0.5, 0.6, 0.7);;
          background: @pick(
            ${colors.yellow[400]},
            ${colors.teal[300]}, ${colors.teal[600]}, ${colors.teal[800]}
          );
          height: @rand(10%, 20%);
          margin: 0 .2rem;
        `}
    </css-doodle>
  </DoodleWrapper>
)

export { Doodle }
