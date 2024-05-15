import { Loader, MnemonicWords, Paragraph, SafeLayout } from "@/components";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

type Props = NativeStackScreenProps<NavigatorParamsList, "Your Mnemonic">;

export default function MnemonicScreen({
  route: {
    params: { address },
  },
}: Props) {
  const { getMnemonic } = useAccountsStore();
  const [mnemonic, setMnemonic] = useState<string[]>([]);

  useEffect(() => {
    setMnemonic(getMnemonic(address).split(" "));
    return () => setMnemonic([]);
  }, [address, getMnemonic]);

  return (
    <SafeLayout>
      {mnemonic?.length > 0 ? (
        <>
          <Paragraph style={{ marginBottom: 30 }}>
            This is your recovery passphrase. Make sure to record these words in
            the correct order, using the corresponding numbers and do not share
            this passphrase with anyone, as it grants full access to your
            account.
          </Paragraph>

          <MnemonicWords mnemonic={mnemonic} />
        </>
      ) : (
        <Loader />
      )}
    </SafeLayout>
  );
}
