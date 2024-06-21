import {
  Column,
  IconButton,
  Paragraph,
  Row,
  SafeLayout,
  Text,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import { useAddressBookStore } from "@/store";
import { FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Add, SearchNormal } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import AddressBookEntry from "./AddressBookEntry";

type Props = NativeStackScreenProps<NavigatorParamsList, "Address Book">;

export default function AddressBook({ navigation }: Props) {
  const { addressBook } = useAddressBookStore();
  const [displayedAddresses, setDisplayedAddresses] = useState(addressBook);
  const searchInput = useInputState();

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

  return (
    <>
      <DashboardHeader>
        <Column>
          <Row
            style={{
              minWidth: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontSize: FontSizes.lg, fontFamily: FontWeights.bold }}
            >
              Address Book
            </Text>
            <IconButton
              style={{ backgroundColor: "transparent" }}
              icon={Add}
              onPress={() => navigation.navigate("Saved Address")}
            />
          </Row>
          <TextInput
            style={{ marginBottom: 0 }}
            placeholder="Search name or SEI address"
            icon={SearchNormal}
            autoCorrect={false}
            {...searchInput}
            showClear
          />
        </Column>
      </DashboardHeader>
      <SafeLayout style={{ paddingTop: 24, paddingBottom: 140 }}>
        <Column>
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
    </>
  );
}
