import React from "react"
import NextImage, { ImageLoaderProps, ImageProps } from "next/image"
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

type PlaceholderProps = {
  placeholderCss?: Record<string, string>
}

type ImageStylingProps = {
  imageClassName?: string
}

export const Image = ({
  src,
  height,
  width,
  objectFit,
  placeholderCss,
  imageClassName,
  ...rest
}: ImageProps & BoxProps & PlaceholderProps & ImageStylingProps) => (
  <Box position="relative" overflow="hidden" {...rest}>
    {placeholderCss && (
      <Box
        pos="absolute"
        inset={0}
        w="full"
        h="full"
        css={placeholderCss}
        style={{ filter: "blur(24px)", transform: "scale(1.2)" }}
      />
    )}
    <NextImage
      loader={imageLoader}
      src={src as string}
      height={height ?? 300}
      width={width ?? 500}
      objectFit={objectFit}
      className={imageClassName}
    />
  </Box>
)
