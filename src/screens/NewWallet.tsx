import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountContext, AccountContextType } from "@/store/account";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import SafeLayout from "@/components/SafeLayout";
import BackButton from "@/components/BackButton";
import MnemonicWords from "@/components/MnemonicWords";
import PrimaryButton from "@/components/PrimaryButton";
import tw from "@/lib/tailwind";

type NewWalletProps = NativeStackScreenProps<MainStackParamList, "New Wallet">;

export default ({ navigation }: NewWalletProps) => {
  const { getNewMnemonic } = useContext(AccountContext) as AccountContextType;
  const [newMnemo, setNewMnemo] = useState<string[]>([]);

  useEffect(() => {
    setNewMnemo(getNewMnemonic().split(" "));
  }, [getNewMnemonic]);

  function onNext() {
    navigation.push("Confirm Mnemonic", { mnemonic: newMnemo });
  }

  return (
    <SafeLayout>
      <BackButton />
      <View style={tw`items-center`}>
        <Text style={tw`title`}>NEW ACCOUNT</Text>

        <Text style={tw`mb-10 text-white px-3`}>
          This is your recovery passphrase. Make sure to record these words in
          the correct order, using the corresponding numbers and do not share
          this passphrase with anyone, as it grants full access to your account.
        </Text>

        <MnemonicWords mnemonic={newMnemo} />

        <PrimaryButton label="Next" styles={tw`mt-5`} onPress={onNext} />
      </View>
    </SafeLayout>
  );
};
