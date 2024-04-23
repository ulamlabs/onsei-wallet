import { Pressable, Text, View } from "react-native";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: string;
  navigation: any;
  disabled?: boolean;
};

export default ({
  icon,
  label,
  navigation,
  navigateTo,
  disabled,
}: LinkProps) => {
  function onPress() {
    if (!disabled) {
      navigation.push(navigateTo);
    }
  }
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15,
        ...(disabled ? { opacity: 0.3 } : {}),
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        {icon}
        <Text style={{ color: "white", fontSize: 16 }}>{label}</Text>
      </View>
      <ArrowRight2 color="white" />
    </Pressable>
  );
};
