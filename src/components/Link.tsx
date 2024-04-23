import { Pressable, Text, View } from "react-native";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";
import { useNavigation } from "@react-navigation/core";
import { NavigationProp, NavigatorParamsList } from "@/types";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: keyof NavigatorParamsList;
  disabled?: boolean;
};

export default ({ icon, label, navigateTo, disabled }: LinkProps) => {
  const navigation = useNavigation<NavigationProp>();

  function onPress() {
    if (!disabled) {
      // TODO typing fails because some routes require params
      navigation.navigate(navigateTo as any);
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
