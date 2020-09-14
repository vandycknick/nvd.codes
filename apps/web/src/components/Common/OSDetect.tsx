import React, { ReactNode } from "react"

type OSDetectProps = {
  windows: ReactNode
  unix: ReactNode
}

const OSDetect: React.FC<OSDetectProps> = ({ windows, unix }) => {
  const platform =
    typeof window !== "undefined"
      ? window.navigator.platform.toLowerCase()
      : "unknown"

  switch (platform) {
    case "win32":
      return <>{windows}</>
    default:
      return <>{unix}</>
  }
}

export { OSDetect }
