import { css } from "@emotion/core"

import { styled } from "components/Tokens"

interface DividerProps {
  text?: string
}

const Divider = styled.div<DividerProps>`
  display: block;
  position: relative;
  border-top: 0.01rem solid #dbdbdb;
  height: 0.1rem;
  margin: 2rem 0;
  text-align: center;

  ${({ theme, text }) =>
    text &&
    css`
      &::after {
        background-color: ${theme.surface};
        color: #b5b5b5;
        content: "${text}";
        display: inline-block;
        font-size: 0.75rem;
        padding: 0.7rem 0.8rem;
        transform: translateY(-1.1rem);
        text-align: center;
      }
    `}
`

export { Divider }
