import { useAuthStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { useNavigation } from "@react-navigation/core";
import { ArrowRight2 } from "iconsax-react-native";
import { ReactElement } from "react";
import { Pressable } from "react-native";
import { Row } from "../layout";
import { Text } from "../typography";
import Option from "./Option";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: keyof NavigatorParamsList;
  disabled?: boolean;
  params?: NavigatorParamsList[keyof NavigatorParamsList];
  askPin?: boolean;
  labelRight?: string;
};

export default function Link({
  icon,
  label,
  navigateTo,
  disabled,
  params,
  askPin,
  labelRight,
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
        <Row>
          {labelRight && <Text>{labelRight}</Text>}
          <ArrowRight2 color={Colors.text100} />
        </Row>
      </Option>
    </Pressable>
  );
}
