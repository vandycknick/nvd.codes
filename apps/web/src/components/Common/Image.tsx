import React, { useState } from "react"
import NextImage, { ImageLoaderProps } from "next/image"
import { Box, BoxProps } from "@chakra-ui/react"

export const imageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => {
  const host =
    process.env.NODE_ENV === "production"
      ? "https://images.nvd.codes"
      : "http://localhost:5000"
  return `${host}${src}?w=${width}&q=${quality ?? 75}`
}

declare type ImgElementStyle = NonNullable<
  JSX.IntrinsicElements["img"]["style"]
>

type ImageWithPlaceholderProps = {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  objectFit?: ImgElementStyle["objectFit"]
  placeholder: string
} & BoxProps

export const Image = NextImage

const useForceUpdate = () => {
  const [, setValue] = useState(0)
  return () => setValue((value) => value + 1)
}

const imageCache = new Set()

export const ImageWithPlaceholder = ({
  src,
  alt,
  height,
  width,
  objectFit,
  placeholder,
  ...rest
}: ImageWithPlaceholderProps) => {
  const [isImageVisible, setImageVisible] = useState(imageCache.has(src))
  const forceUpdate = useForceUpdate()

  const onLoadingComplete = (result: {
    naturalWidth: number
    naturalHeight: number
  }) => {
    if (result.naturalWidth > 1) {
      setImageVisible(true)
      imageCache.add(src)
    } else {
      forceUpdate()
    }
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      {...rest}
      css={{
        "div > img": {
          opacity: isImageVisible ? 1 : 0,
          transition: "opacity 500ms ease 0s",
        },
      }}
    >
      <Box
        css={{
          backgroundImage: `url('${placeholder}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          overflow: "hidden",
          position: "absolute",
          filter: "blur(5px)",
          transform: "scale(0.96)",
          objectFit: "cover",
          objectPosition: "center center",
          opacity: isImageVisible ? "0" : "1",
          transitionDelay: "500ms",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <Image
        layout="responsive"
        loader={imageLoader}
        loading="lazy"
        src={src}
        alt={alt}
        width={width}
        height={height}
        objectFit={objectFit}
        onLoadingComplete={onLoadingComplete}
      />
    </Box>
  )
}
