import { css } from "@emotion/core"

import {
  styled,
  fontFamily,
  spacing,
  fontWeight,
  colors,
} from "src/components/Tokens"
import { PrismTheme } from "src/components/BlogPost/Prism"

const Content = styled(PrismTheme)`
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

      &:hover {
        color: ${colors.teal[700]};
      }
    }

    code {
      background: ${theme.onBackground};
      color: ${theme.background};
      border-radius: 5px;
      padding: 2px;
      font-size: 14px;
    }
  `}
`

export { Content }
