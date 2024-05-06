import {
  Headline,
  Loader,
  PrimaryButton,
  Row,
  SafeLayout,
  Text,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { useModalStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateFee } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { View } from "react-native";

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
    amountInput.onChangeText("Calculating...");
    const balance = activeAccount?.balance || 0;
    const fee = calculateFee(balance, "0.1usei"); // gas price hardcoded for now

    amountInput.onChangeText((balance - +fee.amount[0].amount).toString());
  }

  useEffect(() => {
    if (verified) {
      onSend();
    }
  }, [verified]);

  async function onSend() {
    try {
      setError(null);
      const amount = Number(amountInput.value.replaceAll(",", "."));
      if (!activeAccount?.balance) {
        throw Error("Cannot get balance");
      }
      const fee = calculateFee(
        (activeAccount?.balance - amount) * 10 ** exponent,
        "0.1usei",
      );

      validateTxnData(receiverInput.value, amount, fee);

      setLoading(true);

      await transferAsset(receiverInput.value, +amountInput.value, fee);
      onAfterSubmit();
      setModalVisible(true);
    } catch (error: any) {
      console.error("Error while submitting:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function onAfterSubmit() {
    // TODO Handle adding to notifications
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
