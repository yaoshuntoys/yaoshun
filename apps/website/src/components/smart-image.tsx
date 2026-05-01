import type {ImgHTMLAttributes} from "react";
import NextImage, {type ImageProps, type StaticImageData} from "next/image";

export type {ImageProps, StaticImageData};

function shouldBypassOptimization(src: ImageProps["src"]) {
  return typeof src === "string" && /^https?:\/\//.test(src);
}

function canUsePlainImage(props: ImageProps) {
  const isRemote = shouldBypassOptimization(props.src);
  const hasFill = Boolean(props.fill);
  const hasExplicitSize = typeof props.width !== "undefined" && typeof props.height !== "undefined";
  return isRemote && !hasFill && !hasExplicitSize;
}

export default function SmartImage(props: ImageProps) {
  const bypassOptimization = props.unoptimized ?? shouldBypassOptimization(props.src);

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
      alt,
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

    return <img {...plainProps} />;
  }

  if (bypassOptimization) {
    const {quality: _quality, ...nextProps} = props;
    return <NextImage {...nextProps} unoptimized />;
  }

  return <NextImage {...props} />;
}
