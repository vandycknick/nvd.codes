import React from "react"
import Image, { ImageLoaderProps } from "next/image"
import cx from "classnames"

const imageLoaderInternal = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  const host =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:4000"
  return `${host}${src}?w=${width}&q=${quality ?? 75}`
}

export const imageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => imageLoaderInternal({ src, width, quality })

declare type ImgElementStyle = NonNullable<
  JSX.IntrinsicElements["img"]["style"]
>

type ImageWithLoaderProps = {
  src: string
  alt?: string
  width?: number
  height?: number
  as?: React.ElementType
  fill?: boolean
  objectFit?: ImgElementStyle["objectFit"]
  placeholder: string
  className?: string
}

export const ImageWithLoader = ({
  src,
  alt,
  height,
  width,
  objectFit,
  fill,
  placeholder,
  className,
}: ImageWithLoaderProps) => (
  <Image
    loader={imageLoader}
    loading="lazy"
    src={src}
    alt={alt ?? ""}
    width={width}
    height={height}
    fill={fill ?? false}
    placeholder="blur"
    blurDataURL={placeholder}
    style={{ objectFit }}
    className={className}
  />
)

type BackgroundImageProps = {
  src: string
  width: number
  quality?: number
  className?: string
}

export const BackgroundImage = ({
  src,
  width,
  quality,
  className,
}: BackgroundImageProps) => {
  const url = imageLoaderInternal({ src, width, quality })
  return (
    <div
      className={cx("w-full", className)}
      style={{
        backgroundImage: `url(${url})`,
      }}
    />
  )
}
