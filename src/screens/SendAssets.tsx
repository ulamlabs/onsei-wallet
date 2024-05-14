import {
  Headline,
  Loader,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  Text,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { TransactionsService } from "@/services";
import { useModalStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils/trimAddress";
import { calculateFee } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import D from "decimal.js";
import * as Clipboard from "expo-clipboard";
import { Clipboard as ClipboardCopy } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type SendAssetsProps = NativeStackScreenProps<NavigatorParamsList, "Send">;

export default function SendAssets({
  route: {
    params: { address },
  },
}: SendAssetsProps) {
  const { sei } = useTokensStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const amountInput = useInputState();
  const receiverInput = useInputState();
  const { alert } = useModalStore();
  const transactionsService = new TransactionsService();

  useEffect(() => {
    if (address) {
      receiverInput.onChangeText(address);
    }
  }, []);

  async function onMax() {
    try {
      amountInput.onChangeText("Calculating...");
      const balance = Number(sei.balance) || 0;
      const fee = calculateFee(balance, "0.1usei"); // gas price hardcoded for now
      const maxValue = (balance - +fee.amount[0].amount) / 10 ** 6;

      amountInput.onChangeText(maxValue.toString());
    } catch (error: any) {
      console.error("Error while calculating:", error);
      setError(error.message);
    }
  }

  async function onSend() {
    try {
      setError(null);
      const amount = Number(amountInput.value.replaceAll(",", "."));
      if (!sei.balance) {
        throw Error("Cannot get balance");
      }
      const rawAmount = new D(amount).mul(10 ** 6);
      const fee = calculateFee(rawAmount.toNumber(), "0.1usei");

      transactionsService.validateTxnData(
        receiverInput.value,
        rawAmount.toNumber(),
        fee,
      );

      setLoading(true);

      const transaction = await transactionsService.transferAsset(
        receiverInput.value,
        rawAmount.toNumber(),
        fee,
      );
      onAfterSubmit(transaction);
    } catch (error: any) {
      console.error("Error while submitting:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function onAfterSubmit(transaction: string) {
    // TODO Handle adding to notifications
    amountInput.onChangeText("");
    receiverInput.onChangeText("");
    alert({
      title: "Transfer successful!",
      description: (
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(transaction)}
            style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
          >
            <Paragraph style={{ fontSize: 12 }}>
              ID: {trimAddress(transaction)}
            </Paragraph>
            <ClipboardCopy color={Colors.text} size={16} />
          </TouchableOpacity>
          <Paragraph>
            You successfully transfered {amountInput.value} SEI to{" "}
            {receiverInput.value}
          </Paragraph>
        </View>
      ),
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
