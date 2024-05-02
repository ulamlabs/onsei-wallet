import {
  Headline,
  Loader,
  PrimaryButton,
  TextInput,
  SafeLayout,
  Row,
  Text,
} from "@/components";
import { useInputState } from "@/hooks";
import { useModalStore } from "@/store";
import { Colors } from "@/styles";
import { View } from "react-native";

export default function SendAssets() {
  const loading = false;
  const error: string | null = null;
  const amountInput = useInputState();
  const receiverInput = useInputState();
  const { alert } = useModalStore();

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
