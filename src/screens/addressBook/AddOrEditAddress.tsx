import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  SafeLayout,
  Text,
  TextInput,
  PrimaryButton,
  Column,
  ClipboardAddressBox,
} from "@/components";
import { useInputState } from "@/hooks";
import { useAddressBookStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { Colors } from "@/styles";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Saved Address">;

export default function AddOrEditAddress({ navigation, route }: Props) {
  const { addNewAddress, editAddress } = useAddressBookStore();
  const nameInput = useInputState();
  const addressInput = useInputState();
  const [error, setError] = useState("");
  const [addressFocused, setAddressFocused] = useState(false);
  const addressData = route.params?.addressData;

  useEffect(() => {
    if (addressData) {
      nameInput.onChangeText(addressData.name);
      addressInput.onChangeText(addressData.address);
    }
  }, []);

  useEffect(() => {
    setError("");
  }, [nameInput.value, addressInput.value]);

  async function onAddressFocus() {
    setAddressFocused(true);
  }

  function onAddressBlur() {
    setAddressFocused(false);
  }

  function onPaste(clipboardContent: string) {
    addressInput.onChangeText(clipboardContent);
    setAddressFocused(false);
  }

  async function onSubmit() {
    setError("");
    try {
      if (addressData) {
        editAddress(addressData!.address, nameInput.value, addressInput.value);
      } else {
        addNewAddress(nameInput.value, addressInput.value);
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <SafeLayout>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Column style={{ gap: 16 }}>
          <TextInput
            label="Name"
            placeholder="Name"
            autoCorrect={false}
            {...nameInput}
          />

          <TextInput
            label="Address"
            placeholder="Address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={onAddressFocus}
            onBlur={onAddressBlur}
            {...addressInput}
          />

          {addressFocused && <ClipboardAddressBox onPaste={onPaste} />}
        </Column>

        <Column>
          {error && (
            <Text
              style={{
                marginTop: 10,
                color: Colors.danger,
              }}
            >
              {error}
            </Text>
          )}
          <PrimaryButton
            title="Save address"
            style={{ marginTop: 20 }}
            disabled={!nameInput.value || !addressInput.value}
            onPress={onSubmit}
          />
        </Column>
      </View>
    </SafeLayout>
  );
}
