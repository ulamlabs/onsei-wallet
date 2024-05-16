import React, { useState } from "react";
import { View } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Clipboard as ClipboardCopy,
  Edit2,
  More,
  Trash,
} from "iconsax-react-native";
import Tooltip from "./Tooltip";
import { SavedAddress, useAddressBookStore, useModalStore } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import { TertiaryButton } from "./buttons";
import { Colors } from "@/styles";
import { Row } from "./layout";
import { Text } from "./typography";
import { trimAddress } from "@/utils";

type Props = {
  addressData: SavedAddress;
};

export default function AddressBookEntry({ addressData }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const { removeAddress } = useAddressBookStore();
  const { ask } = useModalStore();

  function onCopy() {
    setVisibleTooltip(false);
    Clipboard.setStringAsync(addressData.address);
  }

  function onEdit() {
    setVisibleTooltip(false);
    navigation.push("Saved Address", { action: "EDIT", addressData });
  }

  async function onRemove() {
    setVisibleTooltip(false);
    const yesno = await ask({
      title: "Remove address?",
      question: `Are you sure you want to remove ${addressData.name} from your address book?\nThis action cannot be reversed.`,
      yes: "Yes, remove the address",
      no: "No, keep the address",
      primary: "yes",
      danger: true,
    });
    if (yesno) {
      removeAddress(addressData.address);
    }
  }

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "black",
        borderRadius: 16,
        gap: 15,
      }}
    >
      <Row>
        <View>
          <Text style={{ fontWeight: "bold" }}>{addressData.name}</Text>
          <Text>{trimAddress(addressData.address)}</Text>
        </View>

        <Tooltip
          onPress={() => setVisibleTooltip(true)}
          toggleElement={<More color={Colors.text} />}
          isVisible={!!visibleTooltip}
          onBackdropPress={() => setVisibleTooltip(false)}
        >
          <TertiaryButton
            onPress={onCopy}
            title="Copy Address"
            icon={ClipboardCopy}
          />
          <TertiaryButton onPress={onEdit} title="Edit Entry" icon={Edit2} />
          <TertiaryButton
            onPress={onRemove}
            title="Remove Entry"
            color={Colors.danger}
            icon={Trash}
          />
        </Tooltip>
      </Row>
    </View>
  );
}
