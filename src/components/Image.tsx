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
  TextStyle,
} from "react-native";

const DEFAULT_PLACEHOLDER_TEXT = "Image not found";

type ImageProps = {
  src: string | null;
  style?: StyleProp<ImageStyle>;
  isError?: boolean;
  placeholderText?: string;
  placeholderTextStyle?: StyleProp<TextStyle>;
  onError?: () => void;
  onLoad?: () => void;
};

export default function Image({
  src,
  style,
  isError,
  placeholderText,
  placeholderTextStyle,
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
    <ImagePlaceholder
      placeholderText={placeholderText}
      style={style}
      placeholderTextStyle={placeholderTextStyle}
    />
  );
}

type ImagePlaceholderProps = {
  placeholderText?: string;
  style?: StyleProp<ViewStyle>;
  placeholderTextStyle?: StyleProp<TextStyle>;
};

function ImagePlaceholder({
  placeholderText,
  style,
  placeholderTextStyle,
}: ImagePlaceholderProps) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={[styles.placeholderText, placeholderTextStyle]}>
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
  placeholderText: {
    color: Colors.text300,
  },
});
