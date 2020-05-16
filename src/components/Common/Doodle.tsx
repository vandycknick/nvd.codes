import React, { Suspense } from "react"
import { css } from "@emotion/core"

import { colors, Theme } from "src/components/Tokens"
import { useTheme } from "emotion-theming"

type CSSDoodleProps = {
  className?: string
  clickToUpdate?: boolean
}

const CSSDoodle = React.lazy(async () => {
  const CSSDoodleInternal: React.FC<CSSDoodleProps> = ({
    children,
    className,
    clickToUpdate,
  }) => (
    <css-doodle class={className} click-to-update={!!clickToUpdate}>
      {children}
    </css-doodle>
  )
  await import("css-doodle")

  return { default: CSSDoodleInternal }
})

const Doodle: React.FC = () => {
  const theme = useTheme<Theme>()
  const isClient = typeof window !== "undefined"

  return (
    <>
      {isClient && (
        <Suspense fallback={<div />}>
          <CSSDoodle
            css={css`
              display: flex;
              background-color: ${theme.background};
            `}
            clickToUpdate={true}
          >
            {`
          :doodle {
            @grid: 1x 60/100vw 2rem;
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
          height: @rand(15%, 45%);
          margin: 0 .2rem;
        `}
          </CSSDoodle>
        </Suspense>
      )}
    </>
  )
}

export { Doodle }
