import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  SafeLayout,
  Headline,
  Text,
  TextInput,
  PrimaryButton,
  Column,
} from "@/components";
import { useInputState } from "@/hooks";
import { useAddressBookStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { Colors } from "@/styles";

type Props = NativeStackScreenProps<NavigatorParamsList, "Saved Address">;

export default function AddOrEditAddress({
  navigation,
  route: {
    params: { action, addressData },
  },
}: Props) {
  const { addNewAddress, editAddress } = useAddressBookStore();
  const nameInput = useInputState();
  const addressInput = useInputState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (action === "EDIT" && addressData) {
      nameInput.onChangeText(addressData.name);
      addressInput.onChangeText(addressData.address);
    }
  }, []);

  async function onSubmit() {
    setError("");
    try {
      if (action === "ADD") {
        addNewAddress(nameInput.value, addressInput.value);
      } else {
        editAddress(addressData!.address, nameInput.value, addressInput.value);
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <SafeLayout>
      <Headline>
        {action === "ADD" ? "Add new entry to" : "Edit entry in"} Address Book
      </Headline>

      <Column>
        <Text>Name</Text>
        <TextInput placeholder="Name" autoCorrect={false} {...nameInput} />

        <Text style={{ marginTop: 20 }}>Address</Text>
        <TextInput
          placeholder="Address"
          autoCapitalize="none"
          autoCorrect={false}
          {...addressInput}
        />
        <PrimaryButton
          title={action === "ADD" ? "Add" : "Update"}
          style={{ marginTop: 20 }}
          onPress={onSubmit}
        />
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
      </Column>
    </SafeLayout>
  );
}
