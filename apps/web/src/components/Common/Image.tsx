import React, { useState } from "react"
import NextImage, { ImageLoaderProps } from "next/image"
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
    process.env.NODE_ENV === "production"
      ? "https://images.nvd.codes"
      : "http://localhost:4000"
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

type ImageWithPlaceholderProps = {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  as?: React.ElementType
  objectFit?: ImgElementStyle["objectFit"]
  placeholder: string
  className?: string
}

export const Image = NextImage

const imageCache = new Set()

export const ImageWithPlaceholder = ({
  src,
  alt,
  height,
  width,
  as,
  objectFit,
  placeholder,
  className,
}: ImageWithPlaceholderProps) => {
  const [isImageVisible, setImageVisible] = useState(imageCache.has(src))
  const Component = as ?? "span"

  const onLoadingComplete = () => {
    if (isImageVisible) return

    setImageVisible(true)
    imageCache.add(src)
  }

  return (
    <Component
      className={cx(
        "relative truncate image__transition block",
        {
          image__visible: isImageVisible,
          image__hidden: !isImageVisible,
        },
        className,
      )}
    >
      <span
        style={{
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
    </Component>
  )
}

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
