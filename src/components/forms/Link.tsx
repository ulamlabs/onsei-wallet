import { useAuthStore } from "@/store";
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
  askPin?: boolean;
};

export default function Link({
  icon,
  label,
  navigateTo,
  disabled,
  params,
  askPin,
}: LinkProps) {
  const navigation = useNavigation<NavigationProp>();
  const { authorize } = useAuthStore();
  function onPress() {
    if (!disabled && !askPin) {
      navigation.navigate(navigateTo as any, params);
    }

    if (askPin && !disabled) {
      authorize(navigation, navigateTo, params);
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
