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

export const ImageWithPlaceholder = ({
  src,
  alt,
  height,
  width,
  objectFit,
  placeholder,
  ...rest
}: ImageWithPlaceholderProps) => {
  const [isPlaceHolderVisible, setPlaceHolderVisibility] = useState(true)

  return (
    <Box position="relative" overflow="hidden" {...rest}>
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
          opacity: isPlaceHolderVisible ? "1" : "0",
          transitionDelay: "500ms",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <Box
        css={{
          opacity: isPlaceHolderVisible ? 0 : 1,
          transition: "opacity 500ms ease 0s",
        }}
      >
        <Image
          layout="responsive"
          loader={imageLoader}
          loading="lazy"
          src={src}
          alt={alt}
          width={width}
          height={height}
          objectFit={objectFit}
          onLoadingComplete={() => {
            // TODO: FIX ME
            setTimeout(() => setPlaceHolderVisibility(false), 300)
          }}
        />
      </Box>
    </Box>
  )
}
