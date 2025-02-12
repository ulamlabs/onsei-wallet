import { getHttpUrl } from "@/modules/nfts/api";
import { useState } from "react";
import { View, Image as RNImage, ImageStyle, StyleProp } from "react-native";

type ImageProps = {
  image: string | null;
  style?: StyleProp<ImageStyle>;
  isError?: boolean;
  onError?: () => void;
  onLoad?: () => void;
};

export default function Image({
  image,
  style,
  isError,
  onError,
  onLoad,
}: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (onError) {
      onError();
    } else {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    } else {
      setHasError(false);
    }
  };

  return image && (!hasError || !isError) ? (
    <RNImage
      source={{ uri: getHttpUrl(image) }}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  ) : (
    <View style={style} />
  );
}
