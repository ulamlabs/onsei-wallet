import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import tw from "@/lib/tailwind";
import { useInputState } from "@/hooks";
import { SafeLayout, Button } from "@/components";
import { NavigatorParamsList } from "@/types";

type NewWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Import Wallet"
>;

export default function ImportWalletScreen({ navigation }: NewWalletProps) {
  const accountsStore = useAccountsStore();
  const nameInput = useInputState();
  const mnemoInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function onImport() {
      try {
        const newAccount = await accountsStore.importAccount(
          nameInput.value.trim(),
          mnemoInput.value.trim(),
        );
        accountsStore.setActiveAccount(newAccount.address);
        accountsStore.subscribeToAccounts();

        const nextRoute: keyof NavigatorParamsList =
          navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
        navigation.navigate(nextRoute);
        resetNavigationStack(navigation);
      } catch (e: any) {
        console.log("Error on wallet import:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      onImport();
    }
  }, [loading, accountsStore, mnemoInput, nameInput, navigation]);

  function onButtonPress() {
    setError("");
    setLoading(true);
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
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
}
