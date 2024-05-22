import { SavedAddress } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { trimAddress } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { ArrowRight2 } from "iconsax-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Box, Text } from "@/components";

type Props = {
  addressData: SavedAddress;
};

export default function AddressBookEntry({ addressData }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.push("Address Details", { addressData })}
    >
      <Box>
        <View>
          <Text
            style={{ fontFamily: FontWeights.bold, fontSize: FontSizes.base }}
          >
            {addressData.name}
          </Text>
          <Text style={{ color: Colors.text100, lineHeight: 21 }}>
            {trimAddress(addressData.address)}
          </Text>
        </View>

        <ArrowRight2 size={22} color={Colors.text} />
      </Box>
    </Pressable>
  );
}
