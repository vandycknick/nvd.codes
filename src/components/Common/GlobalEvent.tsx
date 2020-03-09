import React, { useEffect } from "react"

interface GlobalEventProps {
  type:
    | "resize"
    | "orientationchange"
    | "mousewheel"
    | "DOMMouseScroll"
    | "click"
  listener: () => void
}

const GlobalEvent: React.FC<GlobalEventProps> = ({ type, listener }) => {
  useEffect(() => {
    window.addEventListener(type, listener)
    return () => window.removeEventListener(type, listener)
  }, [type, listener])

  return null
}

export default GlobalEvent
