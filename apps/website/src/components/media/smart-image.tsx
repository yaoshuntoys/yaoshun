import type {ImgHTMLAttributes} from "react";
import NextImage, {type ImageProps, type StaticImageData} from "next/image";

export type {ImageProps, StaticImageData};

type SmartImageProps = ImageProps & {
  preview?: boolean;
};

type StaticRequire = {
  default: StaticImageData;
};

const DEFAULT_IMAGE_QUALITY = 80;

function isRemoteHttpSource(src: ImageProps["src"]) {
  return typeof src === "string" && /^https?:\/\//.test(src);
}

function getPreviewSource(src: ImageProps["src"]) {
  if (typeof src === "string") {
    return src;
  }

  if (typeof src === "object" && src !== null) {
    if ("src" in src && typeof src.src === "string") {
      return src.src;
    }

    if ("default" in src) {
      const staticRequire = src as StaticRequire;
      return staticRequire.default.src;
    }
  }

  return undefined;
}

function canUsePlainImage(props: SmartImageProps) {
  const isRemote = isRemoteHttpSource(props.src);
  const hasFill = Boolean(props.fill);
  const hasExplicitSize = typeof props.width !== "undefined" && typeof props.height !== "undefined";
  return isRemote && !hasFill && !hasExplicitSize;
}

export default function SmartImage(props: SmartImageProps) {
  const {preview = false, ...imageProps} = props;
  const previewSource = preview ? getPreviewSource(imageProps.src) : undefined;
  const previewProps = previewSource
    ? {"data-image-preview-src": previewSource}
    : {};
  const bypassOptimization = imageProps.unoptimized ?? false;
  const nextImageProps =
    typeof imageProps.quality === "undefined"
      ? {...imageProps, quality: DEFAULT_IMAGE_QUALITY}
      : imageProps;

  if (canUsePlainImage(imageProps)) {
    const {
      alt,
      className,
      decoding = "async",
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
    } = imageProps;

    const plainProps: ImgHTMLAttributes<HTMLImageElement> = {
      alt: alt ?? "",
      className,
      decoding,
      draggable,
      fetchPriority: fetchPriority ?? (imageProps.priority ? "high" : undefined),
      height: typeof height === "number" || typeof height === "string" ? height : undefined,
      loading: imageProps.priority ? "eager" : loading,
      onError: onError as ImgHTMLAttributes<HTMLImageElement>["onError"],
      onLoad: onLoad as ImgHTMLAttributes<HTMLImageElement>["onLoad"],
      sizes,
      src: src as string,
      style,
      width: typeof width === "number" || typeof width === "string" ? width : undefined,
      ...previewProps,
    };
    const {alt: plainAlt, ...restPlainProps} = plainProps;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={plainAlt} {...restPlainProps} />;
  }

  if (bypassOptimization) {
    const {quality: _quality, ...nextProps} = nextImageProps;
    return <NextImage {...nextProps} {...previewProps} unoptimized />;
  }

  return <NextImage {...nextImageProps} {...previewProps} />;
}
