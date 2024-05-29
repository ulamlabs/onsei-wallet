import {
  ClipboardAddressBox,
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
import { Scan, TickCircle } from "iconsax-react-native";
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
  const [addressFocused, setAddressFocused] = useState(false);
  const allAddresses = [
    ...allAddressBook.map((address) => address.address),
    ...allAccounts.map((account) => account.address),
  ];

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

  function select(recipientAddress: string) {
    const name = [...allAddressBook, ...allAccounts].find(
      (address) => address.address === recipientAddress,
    )?.name;
    navigation.navigate("transferAmount", {
      ...route.params,
      recipient: { address: recipientAddress, name },
    });
  }

  function validateTypedAddress() {
    if (isValidSeiCosmosAddress(typedAddress)) {
      select(typedAddress);
    } else {
      setIsInvalidAddress(true);
    }
  }

  function scanCode() {
    navigation.navigate("Scan QR code", {
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
            onFocus={() => setAddressFocused(true)}
            onBlur={() => setAddressFocused(false)}
            showClear
            containerStyle={{ flex: 1 }}
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

        {typedAddress && !sameAddressError && (
          <Row style={{ justifyContent: "flex-start" }}>
            <TickCircle variant="Bold" color={Colors.success} />
            <Text style={{ color: Colors.success }}>Correct SEI address</Text>
          </Row>
        )}

        {sameAddressError && (
          <Paragraph style={{ textAlign: "center" }}>
            Sender and receiver cannot be the same address
          </Paragraph>
        )}

        {addressFocused && (!copiedText || copiedText !== typedAddress) && (
          <ClipboardAddressBox
            onPaste={(content) => {
              searchInput.onChangeText(content);
              setCopiedText(content);
            }}
          />
        )}

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          typedAddress &&
          !allAddresses.includes(typedAddress) && (
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
          onPress={validateTypedAddress}
          disabled={!searchInput.value || isInvalidAddress}
        />
      </View>
    </SafeLayout>
  );
}
