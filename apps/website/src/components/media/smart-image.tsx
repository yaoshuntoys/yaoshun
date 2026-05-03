import type {ImgHTMLAttributes} from "react";
import NextImage, {type ImageProps, type StaticImageData} from "next/image";

export type {ImageProps, StaticImageData};

function isRemoteHttpSource(src: ImageProps["src"]) {
  return typeof src === "string" && /^https?:\/\//.test(src);
}

function canUsePlainImage(props: ImageProps) {
  const isRemote = isRemoteHttpSource(props.src);
  const hasFill = Boolean(props.fill);
  const hasExplicitSize = typeof props.width !== "undefined" && typeof props.height !== "undefined";
  return isRemote && !hasFill && !hasExplicitSize;
}

export default function SmartImage(props: ImageProps) {
  const bypassOptimization = props.unoptimized ?? false;
  const nextImageProps =
    typeof props.quality === "undefined"
      ? {...props, quality: 92}
      : props;

  if (canUsePlainImage(props)) {
    const {
      alt,
      className,
      decoding,
      draggable,
      fetchPriority,
      height,
      loading,
      onError,
      onLoad,
      sizes,
      src,
      style,
      width,
    } = props;

    const plainProps: ImgHTMLAttributes<HTMLImageElement> = {
      alt: alt ?? "",
      className,
      decoding,
      draggable,
      fetchPriority: fetchPriority ?? (props.priority ? "high" : undefined),
      height: typeof height === "number" || typeof height === "string" ? height : undefined,
      loading: props.priority ? "eager" : loading,
      onError: onError as ImgHTMLAttributes<HTMLImageElement>["onError"],
      onLoad: onLoad as ImgHTMLAttributes<HTMLImageElement>["onLoad"],
      sizes,
      src: src as string,
      style,
      width: typeof width === "number" || typeof width === "string" ? width : undefined,
    };
    const {alt: plainAlt, ...restPlainProps} = plainProps;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={plainAlt} {...restPlainProps} />;
  }

  if (bypassOptimization) {
    const {quality: _quality, ...nextProps} = nextImageProps;
    return <NextImage {...nextProps} unoptimized />;
  }

  return <NextImage {...nextImageProps} />;
}
