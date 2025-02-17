import { formatIpfsToHttpUrl } from "@/modules/nfts/api";
import { Colors } from "@/styles";
import { useState } from "react";
import {
  View,
  Image as RNImage,
  ImageStyle,
  StyleProp,
  Text,
} from "react-native";

type ImageProps = {
  src: string | null;
  style?: StyleProp<ImageStyle>;
  isError?: boolean;
  placeholderText?: string;
  onError?: () => void;
  onLoad?: () => void;
};

export default function Image({
  src,
  style,
  isError,
  placeholderText,
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

  const shouldShowImage =
    src && (isValid === true || (isValid === null && isError === false));

  return shouldShowImage ? (
    <RNImage
      source={{ uri: formatIpfsToHttpUrl(src) }}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  ) : (
    <View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text style={{ color: Colors.text300 }}>
        {placeholderText ?? "Image not found"}
      </Text>
    </View>
  );
}
