import { Box, Text } from "@/components";
import { SavedAddress } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { trimAddress } from "@/utils";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

type AddressBoxProps = {
  address: SavedAddress;
  onPress?: (address: string) => void;
  icon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export default function AddressBox({
  address,
  onPress,
  icon,
  style,
}: AddressBoxProps) {
  return (
    <Pressable
      style={[style]}
      onPress={() => (onPress ? onPress(address.address) : null)}
    >
      <Box style={{ backgroundColor: Colors.tokenBoxBackground }}>
        <View>
          <Text
            style={{ fontFamily: FontWeights.bold, fontSize: FontSizes.base }}
          >
            {address.name}
          </Text>
          <Text style={{ color: Colors.text100 }}>
            {trimAddress(address.address)}
          </Text>
        </View>
        {icon}
      </Box>
    </Pressable>
  );
}
