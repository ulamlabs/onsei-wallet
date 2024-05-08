import { Pressable } from "react-native";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";
import { useNavigation } from "@react-navigation/core";
import { NavigationProp, NavigatorParamsList } from "@/types";
import Option from "./Option";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: keyof NavigatorParamsList;
  disabled?: boolean;
};

export default function Link({ icon, label, navigateTo, disabled }: LinkProps) {
  const navigation = useNavigation<NavigationProp>();

  function onPress() {
    if (!disabled) {
      navigation.navigate(navigateTo as any);
    }
  }
  return (
    <Pressable onPress={onPress}>
      <Option label={label} icon={icon} disabled={disabled}>
        <ArrowRight2 color="white" />
      </Option>
    </Pressable>
  );
}
