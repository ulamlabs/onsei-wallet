import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Column,
  IconButton,
  Paragraph,
  SafeLayout,
  TextInput,
} from "@/components";
import { Add, SearchNormal } from "iconsax-react-native";
import { useAddressBookStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { useInputState } from "@/hooks";
import AddressBookEntry from "./AddressBookEntry";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native/types";

type Props = NativeStackScreenProps<NavigatorParamsList, "Address Book">;

export default function AddressBook({ navigation }: Props) {
  const { addressBook } = useAddressBookStore();
  const [displayedAddresses, setDisplayedAddresses] = useState(addressBook);
  const searchInput = useInputState();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          style={{ marginRight: 16, backgroundColor: "transparent" }}
          icon={Add}
          onPress={() => navigation.push("Saved Address")}
        />
      ),
    });
  }, []);

  useEffect(() => {
    setDisplayedAddresses(addressBook);
  }, [addressBook]);

  useEffect(() => {
    if (searchInput.value) {
      const inputLowered = searchInput.value.toLowerCase();
      const filteredAddresses = addressBook.filter(
        (a) =>
          a.address.toLowerCase().includes(inputLowered) ||
          a.name.toLowerCase().includes(inputLowered),
      );
      setDisplayedAddresses(filteredAddresses);
    } else {
      setDisplayedAddresses(addressBook);
    }
  }, [searchInput.value]);

  function onFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    console.log("focused");
    e.persist();
    setTimeout(() => {
      console.log("focusing manually");
      e.target.focus();
    }, 10);
  }

  return (
    <SafeLayout>
      <TextInput
        placeholder="Search name or SEI address"
        icon={SearchNormal}
        autoCorrect={false}
        onFocus={onFocus}
        {...searchInput}
        showClear
      />

      <Column style={{ marginTop: 24 }}>
        {displayedAddresses.map((addressData) => (
          <AddressBookEntry
            key={addressData.address}
            addressData={addressData}
          />
        ))}
        {searchInput.value && displayedAddresses.length === 0 && (
          <Paragraph style={{ textAlign: "center" }}>
            No addresses matching the criteria
          </Paragraph>
        )}
      </Column>
    </SafeLayout>
  );
}
