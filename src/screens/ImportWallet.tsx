import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import SafeLayout from "@/components/SafeLayout";
import { useInputState } from "@/hooks";
import tw from "@/lib/tailwind";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { useAccountsStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

type NewWalletProps = NativeStackScreenProps<
  MainStackParamList,
  "Import Wallet"
>;

export default ({ navigation }: NewWalletProps) => {
  const accountsStore = useAccountsStore();
  const nameInput = useInputState();
  const mnemoInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      onImport();
    }
  }, [loading]);

  function onButtonPress() {
    setError("");
    setLoading(true);
  }

  async function onImport() {
    try {
      const newAccount = await accountsStore.importAccount(
        nameInput.value.trim(),
        mnemoInput.value.trim()
      );
      accountsStore.setActiveAccount(newAccount.address);
      accountsStore.subscribeToAccounts();

      navigation.navigate("Connected");
      resetNavigationStack(navigation);
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
        <Button
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
