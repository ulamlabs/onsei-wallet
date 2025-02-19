import { Colors, FontWeights } from "@/styles";
import getInitials from "@/utils/getInitials";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "./Image";
import { Edit2 } from "iconsax-react-native";

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

type EditableAvatarProps = AvatarProps & {
  icon?: React.ReactNode;
  displayIcon?: boolean;
  onPress: () => void;
};

export function EditableAvatar({
  src,
  name,
  size,
  rounded = false,
  icon,
  displayIcon = true,
  onPress,
}: EditableAvatarProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ position: "relative" }}>
      <Avatar src={src} name={name} size={size} rounded={rounded} />
      {displayIcon && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: size * 0.75,
            borderRadius: 300,
            backgroundColor: Colors.tokenBoxBackground,
            borderWidth: 3,
            borderColor: Colors.background,
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon ?? <Edit2 size={22} color={Colors.text} />}
        </View>
      )}
    </TouchableOpacity>
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
