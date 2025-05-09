import useImageValidation from "@/hooks/useImageValidation";
import formatIpfsToHttpUrl from "@/utils/formatIpfsToHttpUrl";
import { Colors } from "@/styles";
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

type PlaceholderConfig = {
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

type ImageProps = {
  src: string | null;
  style?: StyleProp<ImageStyle>;
  isError?: boolean;
  placeholder?: PlaceholderConfig;
  onError?: () => void;
  onLoad?: () => void;
};

export default function Image({
  src,
  style,
  isError,
  placeholder,
  onError,
  onLoad,
}: ImageProps) {
  const [isImageValid, setIsImageValid] = useImageValidation(src);

  const handleError = () => {
    if (onError) {
      onError();
    } else {
      setIsImageValid(false);
    }
  };

  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    } else {
      setIsImageValid(true);
    }
  };

  const shouldShowImage =
    src &&
    (isImageValid === true || (isImageValid === null && isError === false));

  return shouldShowImage ? (
    <RNImage
      source={{ uri: formatIpfsToHttpUrl(src) }}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  ) : (
    <ImagePlaceholder
      text={placeholder?.text}
      style={[style, placeholder?.style]}
      textStyle={placeholder?.textStyle}
    />
  );
}

type ImagePlaceholderProps = {
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function ImagePlaceholder({ text, style, textStyle }: ImagePlaceholderProps) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={[styles.placeholderText, textStyle]}>
        {text ?? DEFAULT_PLACEHOLDER_TEXT}
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
