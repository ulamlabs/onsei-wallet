import {
  Column,
  Paragraph,
  PrimaryButton,
  Text,
  TextInput,
} from "@/components";
import { SavedAddress, useAccountsStore, useAddressBookStore } from "@/store";
import { SafeLayout } from "@/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { useInputState } from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import AddressBox from "./AddressBox";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { Colors } from "@/styles";

type TransferSelectTokenScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSelectAddress"
>;

type AddressListProps = {
  label: string;
  addresses: SavedAddress[];
  onSelect: (address: string) => void;
};
function AddressList({ addresses, label, onSelect }: AddressListProps) {
  if (!addresses.length) {
    return <></>;
  }
  return (
    <>
      <Text style={{ fontWeight: "bold", marginTop: 15 }}>{label}</Text>
      {addresses.map((address) => (
        <AddressBox
          address={address}
          onPress={onSelect}
          key={address.address}
        />
      ))}
    </>
  );
}

export default function TransferSelectAddressScreen({
  navigation,
  route,
}: TransferSelectTokenScreenProps) {
  const searchInput = useInputState();
  const { accounts: allAccounts, activeAccount } = useAccountsStore();
  const { addressBook: allAddressBook } = useAddressBookStore();
  const [addressBook, setAddressBook] = useState(allAddressBook);
  const [yourAddresses, setYourAddresses] = useState(allAccounts);
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);

  useEffect(() => {
    const termLowered = searchInput.value.toLowerCase();
    const addressBook = allAddressBook.filter((a) =>
      a.name.toLowerCase().includes(termLowered),
    );
    const yourAddresses = allAccounts.filter(
      (a) =>
        a.address !== activeAccount?.address &&
        a.name.toLowerCase().includes(termLowered),
    );
    setAddressBook(addressBook);
    setYourAddresses(yourAddresses);
    setIsInvalidAddress(false);
  }, [searchInput.value]);

  const typedAddress = useMemo(() => {
    if (isValidSeiCosmosAddress(searchInput.value)) {
      return searchInput.value;
    }
    return "";
  }, [searchInput.value]);

  const sameAddressError = useMemo(
    () => typedAddress === activeAccount?.address,
    [typedAddress],
  );

  function select(recipient: string) {
    const token = route.params.token;
    navigation.navigate("transferAmount", { token, recipient });
  }

  function validateTypedAddress() {
    if (isValidSeiCosmosAddress(typedAddress)) {
      select(typedAddress);
    } else {
      setIsInvalidAddress(true);
    }
  }

  return (
    <SafeLayout>
      <Column>
        <TextInput
          placeholder="Type name or address"
          {...searchInput}
          autoCorrect={false}
          showClear
        />

        {isInvalidAddress && (
          <Text style={{ color: Colors.danger }}>Invalid SEI address</Text>
        )}

        {sameAddressError && (
          <Paragraph style={{ textAlign: "center" }}>
            Sender and receiver cannot be the same address
          </Paragraph>
        )}

        {typedAddress && !sameAddressError && (
          <AddressBox
            address={{ name: "typed", address: typedAddress }}
            onPress={select}
            key={0}
          />
        )}

        <AddressList
          label="Your addresses"
          addresses={yourAddresses}
          onSelect={select}
        />
        <AddressList
          label="Address book"
          addresses={addressBook}
          onSelect={select}
        />

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          !typedAddress &&
          !isInvalidAddress && (
            <Paragraph style={{ textAlign: "center" }}>
              No addresses matching given criteria
            </Paragraph>
          )}

        <PrimaryButton
          title="Next"
          onPress={validateTypedAddress}
          disabled={!searchInput.value || isInvalidAddress}
        />
      </Column>
    </SafeLayout>
  );
}
