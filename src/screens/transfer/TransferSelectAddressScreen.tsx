import {
  Column,
  IconButton,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  SmallButton,
  Text,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { useAccountsStore, useAddressBookStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import * as Clipboard from "expo-clipboard";
import { CopySuccess, Scan } from "iconsax-react-native";
import { useEffect, useMemo, useState } from "react";
import { SectionList, View } from "react-native";
import AddressBox from "./AddressBox";

type TransferSelectTokenScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSelectAddress"
>;

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
  const [copiedText, setCopiedText] = useState("");
  const [focused, setFocused] = useState(false);
  const allAddresses = [
    ...allAddressBook.map((address) => address.address),
    ...allAccounts.map((account) => account.address),
  ];

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    if (!isValidSeiCosmosAddress(text) || text === activeAccount?.address) {
      return;
    }
    setCopiedText(text);
  };

  useEffect(() => {
    fetchCopiedText();
  }, []);

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

  useEffect(() => {
    const { address } = route.params;
    if (address) {
      searchInput.onChangeText(address);
      validateTypedAddress(address);
    }
  }, [route.params.address]);

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
    const name = [...allAddressBook, ...allAccounts].find(
      (address) => address.address === recipient,
    )?.name;
    navigation.navigate("transferAmount", {
      ...route.params,
      recipient: { address: recipient, name },
    });
  }

  function validateTypedAddress(address: string = typedAddress) {
    if (isValidSeiCosmosAddress(address)) {
      select(address);
    } else {
      setIsInvalidAddress(true);
    }
  }

  function scanCode() {
    navigation.navigate("Scan QR code", {
      nextRoute: "transferSelectAddress",
      tokenId: route.params.tokenId,
    });
  }

  function addToAddressBook() {
    navigation.navigate("Saved Address", { address: typedAddress });
  }

  return (
    <SafeLayout noScroll={true}>
      <Column>
        <Row style={{ gap: 10 }}>
          <TextInput
            placeholder="Type name or address"
            {...searchInput}
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            showClear
          />
          <IconButton
            style={{ height: 51, width: 51 }}
            iconSize={24}
            icon={Scan}
            onPress={scanCode}
          />
        </Row>

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
            address={{ name: "Correct address", address: typedAddress }}
            onPress={select}
            key={0}
          />
        )}

        {focused && copiedText && copiedText !== typedAddress && (
          <AddressBox
            address={{ name: "Paste from clipboard", address: copiedText }}
            onPress={() => searchInput.onChangeText(copiedText)}
            icon={<CopySuccess color={Colors.text100} />}
          />
        )}

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          typedAddress &&
          !allAddresses.some((address) => address === typedAddress) && (
            <SmallButton
              onPress={addToAddressBook}
              title="Add to address book"
              style={{ marginRight: 61 }}
            />
          )}
      </Column>
      <View style={{ flex: 1 }}>
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={[
            { title: "My Wallets", data: yourAddresses },
            { title: "Address book", data: addressBook },
          ]}
          renderItem={(data) => (
            <AddressBox
              address={data.item}
              onPress={select}
              key={data.item.address}
              style={{ marginBottom: 10 }}
            />
          )}
          renderSectionHeader={(data) => {
            return data.section.data.length > 0 ? (
              <Text
                style={{
                  fontFamily: FontWeights.regular,
                  marginTop: 15,
                  marginBottom: 16,
                  color: Colors.text100,
                }}
              >
                {data.section.title}
              </Text>
            ) : (
              <></>
            );
          }}
        />

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          !typedAddress &&
          !isInvalidAddress && (
            <Paragraph style={{ textAlign: "center" }}>
              No addresses matching given criteria
            </Paragraph>
          )}
      </View>
      <View style={{ paddingTop: 24 }}>
        <PrimaryButton
          title="Next"
          onPress={() => validateTypedAddress()}
          disabled={!searchInput.value || isInvalidAddress}
        />
      </View>
    </SafeLayout>
  );
}
