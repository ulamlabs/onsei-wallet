import { BackButton, Button, MnemonicWords, SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { Wallet, useAccountsStore } from "@/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { default as React, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type NewWalletProps = NativeStackScreenProps<MainStackParamList, "New Wallet">;

export default ({ navigation }: NewWalletProps) => {
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
      <BackButton />
      <View style={tw`items-center`}>
        <Text style={tw`title mb-10`}>NEW ACCOUNT</Text>

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
