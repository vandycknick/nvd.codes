import React from "react"
import NextImage, { ImageProps } from "next/image"

export const Image = (props: ImageProps) => {
  const { src, ...rest } = props
  let updatedSrc = src

  if (process.env.NODE_ENV === "production") {
    updatedSrc = `https://image.nvd.codes${src}`
  }

  return <NextImage src={updatedSrc} {...rest} />
}
