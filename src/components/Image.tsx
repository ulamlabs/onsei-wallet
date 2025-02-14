import { formatIpfsToHttpUrl } from "@/modules/nfts/api";
import { useState } from "react";
import { View, Image as RNImage, ImageStyle, StyleProp } from "react-native";

type ImageProps = {
  src: string | null;
  style?: StyleProp<ImageStyle>;
  isError?: boolean;
  onError?: () => void;
  onLoad?: () => void;
};

export default function Image({
  src,
  style,
  isError,
  onError,
  onLoad,
}: ImageProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleError = () => {
    if (onError) {
      onError();
    } else {
      setIsValid(false);
    }
  };

  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    } else {
      setIsValid(true);
    }
  };

  const shouldShowImage = src && (isValid || isValid === null || !isError);

  return shouldShowImage ? (
    <RNImage
      source={{ uri: formatIpfsToHttpUrl(src) }}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  ) : (
    <View style={style} />
  );
}
