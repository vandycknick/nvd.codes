import styled, { css } from "styled-components"

interface DividerProps {
  text?: string
}

const Divider = styled.div<DividerProps>`
  display: block;
  position: relative;
  border-top: 0.1rem solid #dbdbdb;
  height: 0.1rem;
  margin: 2rem 0;
  text-align: center;

  ${props =>
    props.text &&
    css`
      &::after {
        background: #fff;
        color: #b5b5b5;
        content: "${props.text}";
        display: inline-block;
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
        transform: translateY(-1.1rem);
        text-align: center;
      }
    `}
`

export default Divider
