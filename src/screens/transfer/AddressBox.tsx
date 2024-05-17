import { Box, Text } from "@/components";
import { SavedAddress } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { trimAddress } from "@/utils";
import { Pressable, View } from "react-native";

type AddressBoxProps = {
  address: SavedAddress;
  onPress?: (address: string) => void;
};

export default function AddressBox({ address, onPress }: AddressBoxProps) {
  return (
    <Pressable onPress={() => (onPress ? onPress(address.address) : null)}>
      <Box>
        <View>
          <Text style={{ fontFamily: FontWeights.bold }}>{address.name}</Text>
          <Text style={{ color: Colors.text100 }}>
            {trimAddress(address.address)}
          </Text>
        </View>
      </Box>
    </Pressable>
  );
}
