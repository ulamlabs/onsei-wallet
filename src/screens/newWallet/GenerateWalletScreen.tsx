import {
  Column,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { Wallet, useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { default as React, ReactElement, useEffect, useState } from "react";

type GenerateWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Generate Wallet"
>;

export default function GenerateWalletScreen({
  navigation,
}: GenerateWalletProps) {
  const accountsStore = useAccountsStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    accountsStore.generateWallet().then(setWallet);
  }, [accountsStore]);

  function onNext() {
    navigation.push("Confirm Mnemonic", { wallet: wallet! });
  }

  function getContent(): ReactElement {
    if (!wallet) {
      return <Loader />;
    }

    return (
      <>
        <Paragraph>
          This is your recovery passphrase. Make sure to record these words in
          the correct order, using the corresponding numbers and do not share
          this passphrase with anyone, as it grants full access to your account.
        </Paragraph>

        <MnemonicWords mnemonic={wallet.mnemonic.split(" ")} />

        <PrimaryButton title="Next" onPress={onNext} />
      </>
    );
  }

  return (
    <SafeLayout>
      <Column style={{ alignItems: "center" }}>{getContent()}</Column>
    </SafeLayout>
  );
}
