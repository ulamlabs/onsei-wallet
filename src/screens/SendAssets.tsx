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
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
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
    amountInput.onChangeText!("Calculating...");
    const balance = await getRawBalance(activeAccount?.address!);
    const fee = calculateFee(balance, "0.1usei");

    amountInput.onChangeText!((balance - +fee.amount[0].amount).toString());
  }

  async function onSend() {
    setError(null);
    if (!receiverInput.value || !amountInput.value) {
      setError("All inputs need to be filled");
      return;
    }
    if (receiverInput.value === activeAccount?.address) {
      setError("You cannot send funds to your own address");
      return;
    }
    try {
      isValidSeiCosmosAddress(receiverInput.value);
    } catch (e) {
      setError("Invalid receiver address");
      return;
    }
    const amount = Number(amountInput.value.replaceAll(",", "."));
    if (Number.isNaN(amount) || amount === 0) {
      setError("Invalid amount entered");
      return;
    }
    const fee = +calculateFee(amount, "0.1usei").amount[0].amount;
    if (amount > activeAccount?.balance! - fee) {
      setError("Insufficient funds");
      return;
    }
    setLoading(true);
    try {
      const txnHash = await transferAsset(receiverInput.value, amount);
      console.log(`Submitted with hash ${txnHash}`);
      onAfterSubmit();
      setModalVisible(true);
    } catch (error: any) {
      console.log("Error while submitting:", error);
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
