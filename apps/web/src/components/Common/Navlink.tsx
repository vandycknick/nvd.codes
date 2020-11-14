import React from "react"
import { css } from "@emotion/css"
import { useTheme } from "@emotion/react"
import Link from "next/link"
import { useRouter } from "next/router"

import { spacing, fontFamily, fontWeight, fontSize } from "components/Tokens"
import { fromTablet } from "components/Common/mediaQuery"

const borderSize = "5px"

interface NavLinkProps {
  to: string
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const theme = useTheme()
  const router = useRouter()
  return (
    <Link href={to}>
      <a
        className={css`
          font-family: ${fontFamily.headings};
          font-weight: ${fontWeight.bold};
          font-size: ${fontSize.xl};
          color: ${theme.onNavigation};
          display: flex;
          align-items: center;
          text-decoration: none;
          padding: ${spacing[4]};
          box-sizing: border-box;

          ${fromTablet`font-size: ${fontSize.base};`}

          &:hover {
            color: ${theme.primaryLighter};
            cursor: pointer;
          }

          ${
            router.pathname === to &&
            fromTablet`
              padding-bottom: calc(${spacing[4]} - ${borderSize});
              border-bottom: ${borderSize} solid ${theme.primary};
          `
          }
          }
        `}
      >
        {children}
      </a>
    </Link>
  )
}

export { NavLink }
