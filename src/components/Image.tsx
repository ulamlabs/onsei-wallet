import { formatIpfsToHttpUrl } from "@/modules/nfts/api";
import { Colors } from "@/styles";
import { useState } from "react";
import {
  View,
  Image as RNImage,
  ImageStyle,
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
} from "react-native";

const DEFAULT_PLACEHOLDER_TEXT = "Image not found";

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
    <ImagePlaceholder placeholderText={placeholderText} style={style} />
  );
}

type ImagePlaceholderProps = {
  placeholderText?: string;
  style?: StyleProp<ViewStyle>;
};

function ImagePlaceholder({ placeholderText, style }: ImagePlaceholderProps) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={{ color: Colors.text300 }}>
        {placeholderText ?? DEFAULT_PLACEHOLDER_TEXT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
