import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AddressBookEntry,
  Column,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useAddressBookStore } from "@/store";
import { NavigatorParamsList } from "@/types";

type Props = NativeStackScreenProps<NavigatorParamsList, "Address Book">;

export default function AddressBook({ navigation }: Props) {
  const { addressBook } = useAddressBookStore();

  function onAddNew() {
    navigation.push("Saved Address", { action: "ADD" });
  }

  return (
    <SafeLayout>
      <Paragraph style={{ marginBottom: 30 }}>
        Here you can find the list of your known addresses as well as add new
        ones. They will be easily accessible in the receiver input while sending
        assets.
      </Paragraph>

      <Column>
        <PrimaryButton
          onPress={onAddNew}
          style={{ paddingVertical: 10, marginLeft: "auto" }}
          title="+"
        />

        {addressBook.map((addressData) => (
          <AddressBookEntry
            key={addressData.address}
            addressData={addressData}
          />
        ))}
      </Column>
    </SafeLayout>
  );
}
