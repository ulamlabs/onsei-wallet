import {
  Column,
  CopyButton,
  Headline,
  IconButton,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import { useTransactions } from "@/modules/transactions";
import { useAccountsStore, useAddressBookStore, useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Edit2, Trash } from "iconsax-react-native";
import React, { useEffect } from "react";
import LastTransactionsWithAddress from "./LastTransactionsWithAddress";

type Props = NativeStackScreenProps<NavigatorParamsList, "Address Details">;

export default function AddressDetailsScreen({
  navigation,
  route: {
    params: { addressData },
  },
}: Props) {
  const { activeAccount } = useAccountsStore();
  const { removeAddress } = useAddressBookStore();
  const { refetch } = useTransactions(activeAccount!.address);
  const { ask } = useModalStore();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          style={{ backgroundColor: "transparent", paddingRight: 0 }}
          icon={Edit2}
          onPress={() => navigation.navigate("Saved Address", { addressData })}
        />
      ),
    });
  }, []);

  async function onRemove() {
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
      navigation.goBack();
    }
  }

  return (
    <SafeLayout refreshFn={refetch}>
      <Column style={{ flex: 1 }}>
        <Headline style={{ marginTop: 28 }}>{addressData.name}</Headline>

        <CopyButton
          title={trimAddress(addressData.address)}
          toCopy={addressData.address}
        />

        <LastTransactionsWithAddress addressData={addressData} />

        <TertiaryButton
          title="Delete address"
          icon={Trash}
          color={Colors.danger}
          style={{ marginTop: "auto" }}
          textStyle={{ fontFamily: FontWeights.bold }}
          onPress={onRemove}
        />
      </Column>
    </SafeLayout>
  );
}
