import * as React from "react";
import FastImage from "react-native-fast-image";

const _imageResizeMode = {
  contain: FastImage.resizeMode.contain,
  cover: FastImage.resizeMode.cover,
  stretch: FastImage.resizeMode.stretch,
  center: FastImage.resizeMode.center,
};

export const Image = ({
  source,
  style,
  resizeMode = "cover",
  className,
  ...props
}) => {
  const imageResizeMode = _imageResizeMode[resizeMode];
  return (
    <FastImage
      source={
        Object.prototype.hasOwnProperty.call(source, "uri")
          ? { ...source, cache: FastImage.cacheControl.immutable }
          : source
      }
      className={className}
      style={style}
      resizeMode={imageResizeMode}
      {...props}
    />
  );
};

export const preloadImages = (sources = []) => {
  FastImage.preload(sources.map((source) => ({ uri: source })));
};
