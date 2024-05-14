import { NavigationProp, NavigatorParamsList } from "@/types";
import { useNavigation } from "@react-navigation/core";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";
import { Pressable } from "react-native";
import Option from "./Option";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: keyof NavigatorParamsList;
  disabled?: boolean;
  params?: NavigatorParamsList[keyof NavigatorParamsList];
};

export default function Link({
  icon,
  label,
  navigateTo,
  disabled,
  params,
}: LinkProps) {
  const navigation = useNavigation<NavigationProp>();
  function onPress() {
    if (!disabled) {
      navigation.navigate(navigateTo as any, params);
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
