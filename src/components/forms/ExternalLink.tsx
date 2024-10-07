import { Colors } from "@/styles";
import { ExportSquare } from "iconsax-react-native";
import { ReactElement } from "react";
import { Linking, Pressable } from "react-native";
import { Row } from "../layout";
import Option from "./Option";

export type LinkProps = {
  label: string;
  icon?: ReactElement;
  navigateTo: string;
};

export default function ExternalLink({ icon, label, navigateTo }: LinkProps) {
  function onPress() {
    Linking.openURL(navigateTo);
  }

  return (
    <Pressable onPress={onPress}>
      <Option label={label} icon={icon}>
        <Row>
          <ExportSquare color={Colors.text} />
        </Row>
      </Option>
    </Pressable>
  );
}
