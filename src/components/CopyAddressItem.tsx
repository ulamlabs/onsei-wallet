import { Colors, FontSizes, FontWeights } from "@/styles";
import { trimAddress } from "@/utils";
import * as Clipboard from "expo-clipboard";
import { Copy as CopyIcon, TickCircle } from "iconsax-react-native";
import { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Option, OptionGroup } from "./forms";
import { Row } from "./layout";
import { Text } from "./typography";

type CopyAddressItemProps = {
  type: "SEI" | "EVM";
  address: string;
};

const SEI_LOGO = require("../../assets/sei-logo.png");

export default function CopyAddressItem({
  type,
  address,
}: CopyAddressItemProps) {
  const [clicked, setClicked] = useState(false);
  function onPress() {
    if (clicked) {
      return;
    }
    setClicked(true);
    Clipboard.setStringAsync(address);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  }

  return (
    <TouchableOpacity style={{ marginVertical: 5 }} onPress={onPress}>
      <OptionGroup>
        <Option
          icon={<Image source={SEI_LOGO} style={{ width: 32, height: 42 }} />}
        >
          <Row style={{ flex: 1 }}>
            <View>
              <Text
                style={{
                  fontFamily: FontWeights.bold,
                  fontSize: FontSizes.base,
                }}
              >
                {type} address
              </Text>
              <Text
                style={{
                  color: Colors.text100,
                }}
              >
                {trimAddress(address)}
              </Text>
            </View>

            {clicked ? (
              <TickCircle variant="Bold" color={Colors.success} />
            ) : (
              <CopyIcon color={Colors.text} />
            )}
          </Row>
        </Option>
      </OptionGroup>
    </TouchableOpacity>
  );
}
