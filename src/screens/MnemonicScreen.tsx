import { MnemonicWords, SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";

type Props = NativeStackScreenProps<ConnectedStackParamList, "MnemonicScreen">;

export default ({
  route: {
    params: { mnemonic },
  },
}: Props) => {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title mb-10`}>Your PassPhrase</Text>

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
