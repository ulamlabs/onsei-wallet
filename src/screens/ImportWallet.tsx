import React, { useContext, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountContext, AccountContextType } from "@/store/account";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { Text, TextInput, View } from "react-native";
import SafeLayout from "@/components/SafeLayout";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useInputState } from "@/hooks";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";
import tw from "@/lib/tailwind";

type NewWalletProps = NativeStackScreenProps<
  MainStackParamList,
  "Import Wallet"
>;

export default ({ navigation }: NewWalletProps) => {
  const { fetchAccount, changeActiveAccount, subscribeToAccounts } = useContext(
    AccountContext
  ) as AccountContextType;
  const { validateEntry, addNewAddress } = useContext(
    AddressBookContext
  ) as AddressBookContextType;
  const nameInput = useInputState();
  const mnemoInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      onImport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function onButtonPress() {
    setError("");
    setLoading(true);
  }

  async function onImport() {
    // TODO: Find equivalent in SEI
    /* if (!mnemonicValidate(mnemoInput.value!)) {
      setError("Provided mnemonic is invalid");
      setLoading(false);
      return;
    } */
    try {
      validateEntry(nameInput.value);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return;
    }

    let newAccount: string;
    try {
      newAccount = await fetchAccount(mnemoInput.value!);

      addNewAddress(nameInput.value, newAccount!);
      changeActiveAccount(newAccount!);
      subscribeToAccounts();
      navigation.navigate("Connected");
    } catch (e: any) {
      console.log("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeLayout>
      <BackButton />
      <View style={tw`items-center`}>
        <Text style={tw`title`}>IMPORT ACCOUNT</Text>
        <Text style={tw`text-white`}>Name of your wallet</Text>
        <TextInput
          style={tw`input mt-2 w-[90%]`}
          placeholder="Name"
          autoCorrect={false}
          {...nameInput}
        />
        <Text style={tw`text-white mt-10`}>Mnemonic</Text>
        <TextInput
          multiline={true}
          style={tw`input mt-2 mb-5 w-[90%] min-h-20`}
          placeholder="Mnemonic"
          autoCapitalize="none"
          autoCorrect={false}
          {...mnemoInput}
        />
        <PrimaryButton
          label="Import"
          styles={tw`mt-5`}
          isLoading={loading}
          onPress={onButtonPress}
        />
        {error && <Text style={tw`mt-2 text-sm text-danger-500`}>{error}</Text>}
      </View>
    </SafeLayout>
  );
};
