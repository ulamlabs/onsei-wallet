import { Paragraph, PrimaryButton, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { generateWalletName } from "@/utils";
import { validateName } from "@/utils/validateInputs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Set Name">;

export default function SetWalletNameScreen({
  navigation,
  route: {
    params: { nextRoute },
  },
}: Props) {
  const name = useInputState();
  const [error, setError] = useState("");
  const { accounts } = useAccountsStore();

  useEffect(() => {
    name.onChangeText(generateWalletName(accounts));
  }, []);

  useEffect(() => {
    setError("");
  }, [name.value]);

  const next = () => {
    try {
      validateName(name.value, accounts);
      navigation.navigate(nextRoute, { name: name.value });
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <SafeLayout
      noScroll={true}
      style={{
        justifyContent: "space-between",
        maxHeight: "100%",
      }}
    >
      <View>
        <Paragraph style={{ marginBottom: 12 }}>
          Give your wallet name to easily identify it. Names are stored locally
          and can only be seen by you.
        </Paragraph>
        <TextInput {...name} error={!!error} />
        {error && (
          <Paragraph style={{ color: Colors.danger }}>{error}</Paragraph>
        )}
      </View>
      <PrimaryButton title="Next" onPress={next} />
    </SafeLayout>
  );
}
