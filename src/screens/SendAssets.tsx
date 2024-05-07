import {
  Headline,
  Loader,
  PrimaryButton,
  SafeLayout,
  Row,
  Text,
  TextInput,
} from "@/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useInputState } from "@/hooks";
import { useModalStore } from "@/store";
import { Colors } from "@/styles";
import { View } from "react-native";
import { NavigatorParamsList } from "@/types";
import { useEffect } from "react";

type SendAssetsProps = NativeStackScreenProps<NavigatorParamsList, "Send">;

export default function SendAssets({
  route: {
    params: { address },
  },
}: SendAssetsProps) {
  const loading = false;
  const error: string | null = null;
  const amountInput = useInputState();
  const receiverInput = useInputState();
  const { alert } = useModalStore();

  useEffect(() => {
    if (address) {
      receiverInput.onChangeText(address);
    }
  }, []);

  async function onMax() {
    // TODO: handle max am ount
  }

  async function onSend() {
    // TODO: handle send
    alert({
      title: "Transfer successful!",
      description: `You successfully transfered ${amountInput.value} SEI to ${receiverInput.value}`,
    });
  }

  return (
    <SafeLayout style={{ gap: 50 }}>
      <Headline>Send Assets</Headline>

      <View style={{ gap: 10 }}>
        <Text>Provide address of the receiver</Text>
        <TextInput placeholder="Receiver address" {...receiverInput} />
      </View>

      <View style={{ gap: 10 }}>
        <Text>Amount to send</Text>
        <Row>
          <TextInput
            placeholder="Amount"
            keyboardType="decimal-pad"
            style={{ flex: 1 }}
            {...amountInput}
          />
          <PrimaryButton title="MAX" onPress={onMax} />
        </Row>
      </View>

      {loading ? (
        <Loader />
      ) : (
        <PrimaryButton title="Sign and Send" onPress={onSend} />
      )}

      {error && <Text style={{ color: Colors.danger }}>{error}</Text>}
    </SafeLayout>
  );
}
