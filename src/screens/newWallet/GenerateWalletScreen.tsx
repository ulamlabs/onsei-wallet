import { Button, MnemonicWords, SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { Wallet, useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { default as React, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type GenerateWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Generate Wallet"
>;

export default ({ navigation }: GenerateWalletProps) => {
  const accountsStore = useAccountsStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    accountsStore.generateWallet().then(setWallet);
  }, []);

  function onNext() {
    navigation.push("Confirm Mnemonic", { wallet: wallet! });
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        {wallet ? (
          <>
            <Text style={tw`mb-10 text-white px-3`}>
              This is your recovery passphrase. Make sure to record these words
              in the correct order, using the corresponding numbers and do not
              share this passphrase with anyone, as it grants full access to
              your account.
            </Text>

            <MnemonicWords mnemonic={wallet.mnemonic.split(" ")} />

            <Button label="Next" styles={tw`mt-5`} onPress={onNext} />
          </>
        ) : (
          <ActivityIndicator size="large" color="#fff" style={tw`mt-20`} />
        )}
      </View>
    </SafeLayout>
  );
};
