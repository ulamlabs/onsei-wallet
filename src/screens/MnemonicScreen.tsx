import { MnemonicWords, SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Your Mnemonic">;

export default ({
  route: {
    params: { address },
  },
}: Props) => {
  const { getMnemonic } = useAccountsStore();
  const [mnemonic, setMnemonic] = useState<string[]>([]);

  useEffect(() => {
    setMnemonic(getMnemonic(address).split(" "));
    return () => setMnemonic([]);
  }, []);

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        {mnemonic?.length > 0 ? (
          <>
            <Text style={tw`mb-10 text-white px-3`}>
              This is your recovery passphrase. Make sure to record these words
              in the correct order, using the corresponding numbers and do not
              share this passphrase with anyone, as it grants full access to
              your account.
            </Text>

            <MnemonicWords mnemonic={mnemonic} />
          </>
        ) : (
          <ActivityIndicator size="large" color="#fff" style={tw`mt-20`} />
        )}
      </View>
    </SafeLayout>
  );
};
