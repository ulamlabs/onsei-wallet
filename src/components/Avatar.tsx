import { Colors, FontWeights } from "@/styles";
import getInitials from "@/utils/getInitials";
import { StyleSheet } from "react-native";
import Image from "./Image";

type AvatarProps = {
  src: string | null;
  name: string;
  size: number;
  rounded?: boolean;
};

export default function Avatar({
  src,
  name,
  size,
  rounded = false,
}: AvatarProps) {
  const fontSize = size / 3;
  const lineHeight = fontSize * 1.2;
  const borderRadius = rounded ? size : size / 3;

  return (
    <Image
      src={src}
      style={[styles.avatar, { width: size, height: size, borderRadius }]}
      placeholderTextStyle={[
        styles.avatarPlaceholderText,
        { fontSize, lineHeight },
      ]}
      placeholderText={getInitials(name)}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.markerBackground,
  },
  avatarPlaceholderText: {
    color: Colors.text,
    fontFamily: FontWeights.bold,
    letterSpacing: 0,
  },
});
