import { css } from "@emotion/css"
import styled from "@emotion/styled"

import {
  fontFamily,
  spacing,
  fontWeight,
  colors,
  shadow,
} from "components/Tokens"

const Content = styled.section`
  ${({ theme }) => css`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: ${fontFamily.headings};
      padding: ${spacing[4]} 0;
      font-weight: ${fontWeight.bold};
      line-height: 1.125;
    }

    p {
      padding-bottom: ${spacing[4]};
    }

    ul,
    ol {
      margin: ${spacing[1]} 0 ${spacing[4]} ${spacing[12]};
    }

    ul {
      list-style-type: disc;
      list-style-position: outside;
    }

    ol {
      list-style-type: decimal;
      list-style-position: outside;
    }

    a {
      color: ${colors.teal[500]};
      overflow-wrap: break-word;
      word-wrap: break-word;

      &:hover {
        color: ${colors.teal[700]};
      }
    }

    details {
      padding-bottom: ${spacing[4]};

      summary {
        padding-bottom: ${spacing[2]};
      }
    }

    blockquote {
      font-style: italic;
      border-width: 0 0 0 4px;
      border-color: ${colors.teal[600]};
      border-style: solid;
      padding-left: ${spacing[8]};
      margin-top: ${spacing[6]};
      margin-bottom: ${spacing[6]};
    }

    blockquote p {
      padding-top: ${spacing[2]};
      padding-bottom: ${spacing[2]};
    }

    code {
      background: ${theme.onBackground};
      color: ${theme.background};
      border-radius: 5px;
      padding: 2px;
      font-size: 14px;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    pre {
      background: #191d21;
      border-radius: 5px;
      box-shadow: ${shadow.inner};
      margin-bottom: ${spacing[4]};
      padding: ${spacing[4]};
      overflow: auto;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;

      code {
        background: ${theme.transparent};
        color: ${theme.onBackground};
        font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      }
    }
  `}
`

export { Content }
