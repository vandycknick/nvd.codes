import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

const usePortal = (selector: string) => {
  const wrapper = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!canUseDOM()) {
      return
    }

    const leWrapper = getWrapper()
    const body = document.querySelector(selector)
    body?.appendChild(leWrapper)

    return () => {
      body?.removeChild(leWrapper)
      leWrapper.remove()
    }
  }, [selector])

  const getWrapper = () => {
    if (wrapper.current == null) {
      wrapper.current = document.createElement("div")
    }
    return wrapper.current
  }

  if (!canUseDOM()) return
  return getWrapper()
}

const canUseDOM = () => {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}

type PortalProps = {
  selector: string
  children?: React.ReactNode
}

const Portal = ({ selector, children }: PortalProps) => {
  const wrapper = usePortal(selector)

  if (wrapper == null) return null

  return ReactDOM.createPortal(children, wrapper)
}

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  initialFocusRef?: React.RefObject<HTMLElement>
  finalFocusRef?: React.RefObject<HTMLElement>
}

export const Drawer = ({
  isOpen,
  children,
  onClose,
  initialFocusRef,
  finalFocusRef,
}: DrawerProps) => {
  const [isDrawerRendered, setDrawerRendered] = useState(false)
  const [isDrawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    let timer: number | undefined
    if (isOpen) {
      setDrawerRendered(true)
    }

    if (!isOpen) {
      timer = setTimeout(
        () => setDrawerRendered(false),
        1500,
      ) as unknown as number
    }

    return () => {
      clearTimeout(timer)
      setDrawerRendered(isOpen)
    }
  }, [isOpen])

  useEffect(() => {
    let timer: number | undefined
    if (isOpen) {
      timer = setTimeout(() => setDrawerVisible(true), 100) as unknown as number
    }

    if (!isOpen) {
      setDrawerVisible(false)
    }
    return () => {
      clearTimeout(timer)
      setDrawerVisible(isOpen)
    }
  }, [isOpen])

  useEffect(() => {
    const focus = finalFocusRef?.current
    initialFocusRef?.current?.focus()
    return () => {
      focus?.focus()
    }
  })

  const backDropEl = useRef(null)
  const onCloseDrawer = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (backDropEl.current == null) return

      if (event.target == backDropEl.current) {
        onClose()
      }
    },
    [onClose],
  )
  if (!isDrawerRendered) return null

  return (
    <Portal selector="body">
      <div
        ref={backDropEl}
        className={
          "fixed overflow-hidden bg-nord-800 bg-opacity-25 inset-0 z-50 transform ease-in-out" +
          (isDrawerVisible
            ? " transition-opacity opacity-100 duration-500 translate-y-0"
            : "transition-all delay-500 opacity-0 translate-y-full")
        }
        onClick={onCloseDrawer}
      >
        <section
          className={
            "w-screen max-w-full top-0 bottom-0 absolute bg-nord-50 dark:bg-nord-900 h-full shadow-xl delay-200 duration-300 ease-in-out transition-all transform" +
            (isDrawerVisible ? " -translate-y-0 " : " -translate-y-full ")
          }
        >
          {children}
        </section>
      </div>
    </Portal>
  )
}
