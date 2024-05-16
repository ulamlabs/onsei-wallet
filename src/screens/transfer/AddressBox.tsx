import { Text } from "@/components";
import { Colors } from "@/styles";
import { Pressable, View } from "react-native";
import { Box } from "@/components";
import { SavedAddress } from "@/store";
import { trimAddress } from "@/utils";

type AddressBoxProps = {
  address: SavedAddress;
  onPress?: (address: string) => void;
};

export default function AddressBox({ address, onPress }: AddressBoxProps) {
  return (
    <Pressable onPress={() => (onPress ? onPress(address.address) : null)}>
      <Box>
        <View>
          <Text style={{ fontWeight: "bold" }}>{address.name}</Text>
          <Text style={{ color: Colors.text100 }}>
            {trimAddress(address.address)}
          </Text>
        </View>
      </Box>
    </Pressable>
  );
}
