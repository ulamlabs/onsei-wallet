import { Column, EmptyList, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useAddressBookStore } from "@/store";
import { SearchNormal } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AddressBookEntry from "./AddressBookEntry";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";

export type AddressBookNavParams =
  | { addressCount?: number; allAddressCount?: number }
  | undefined;

type Props = NativeStackScreenProps<NavigatorParamsList, "Address Book">;

export default function AddressBook({ navigation }: Props) {
  const { addressBook } = useAddressBookStore();
  const [displayedAddresses, setDisplayedAddresses] = useState(addressBook);
  const searchInput = useInputState();

  useEffect(() => {
    setDisplayedAddresses(addressBook);
    navigation.setParams({ allAddressCount: addressBook.length });
  }, [addressBook]);

  useEffect(() => {
    navigation.setParams({ addressCount: displayedAddresses.length });
  }, [displayedAddresses]);

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

  return (
    <>
      <SafeLayout>
        <TextInput
          style={{ marginBottom: 24 }}
          placeholder="Search name or SEI address"
          icon={SearchNormal}
          autoCorrect={false}
          {...searchInput}
          showClear
        />
        <Column>
          {displayedAddresses.map((addressData) => (
            <AddressBookEntry
              key={addressData.address}
              addressData={addressData}
            />
          ))}
          {displayedAddresses.length === 0 && (
            <View style={{ height: "100%" }}>
              <EmptyList
                title={`No addresses ${searchInput.value ? "found" : "yet"}`}
                description={
                  searchInput.value && "No addresses matching the criteria"
                }
              />
            </View>
          )}
        </Column>
      </SafeLayout>
    </>
  );
}
