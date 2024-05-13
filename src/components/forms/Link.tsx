import { NavigationProp, NavigatorParamsList } from "@/types";
import { useNavigation } from "@react-navigation/core";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";
import { Pressable } from "react-native";
import Option from "./Option";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo?: keyof NavigatorParamsList;
  disabled?: boolean;
  onPress?: () => void;
};

export default function Link({
  icon,
  label,
  navigateTo,
  disabled,
  onPress,
}: LinkProps) {
  const navigation = useNavigation<NavigationProp>();

  function press() {
    if (!disabled) {
      if (onPress) {
        onPress();
        return;
      }
      navigation.navigate(navigateTo as any);
    }
  }
  return (
    <Pressable onPress={press}>
      <Option label={label} icon={icon} disabled={disabled}>
        <ArrowRight2 color="white" />
      </Option>
    </Pressable>
  );
}
