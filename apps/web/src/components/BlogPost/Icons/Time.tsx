import React from "react"
import { createIcon } from "@chakra-ui/react"

const Time = createIcon({
  displayName: "TimeIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <path
        fill="currentColor"
        d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
      />
      <path
        fill="currentColor"
        d="M13 7H11V12.414L14.293 15.707L15.707 14.293L13 11.586V7Z"
      />
    </>
  ),
})

export { Time }
