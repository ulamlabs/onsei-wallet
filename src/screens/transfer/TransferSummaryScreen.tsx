import {
  Loader,
  Option,
  OptionGroup,
  PrimaryButton,
  SafeLayoutBottom,
  Text,
} from "@/components";
import TransferAmount from "./TransferAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { toDecimalAmount, trimAddress } from "@/utils";
import { View } from "react-native";
import { useTokensStore } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { estimateTransferFee } from "@/services/cosmos/tx";
import { StdFee } from "@cosmjs/stargate";
import { Colors } from "@/styles";

type TransferSummaryScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSummary"
>;

export default function TransferSummaryScreen({
  navigation,
  route,
}: TransferSummaryScreenProps) {
  const transfer = route.params;
  const { sei } = useTokensStore();
  const [fee, setFee] = useState<StdFee | null>(null);
  const [estimationFailed, setEstimationFailed] = useState(false);

  useEffect(() => {
    estimateTransferFee(transfer.recipient, transfer.token, transfer.intAmount)
      .then(setFee)
      .catch(() => setEstimationFailed(true));
  }, []);

  const hasFundsForFee = useMemo(() => {
    if (!fee) {
      return false;
    }
    let seiLeft = Number(sei.balance) - Number(fee.amount[0].amount);
    if (transfer.token.id === sei.id) {
      seiLeft -= Number(transfer.intAmount);
    }
    return seiLeft >= 0;
  }, [fee]);

  function send() {
    if (!fee) {
      return;
    }
    navigation.navigate("transferSending", { ...transfer, fee });
  }

  function getFeeElement() {
    if (fee) {
      return (
        <Text>
          {toDecimalAmount(sei, fee.amount[0].amount)} {sei.symbol}
        </Text>
      );
    }

    if (estimationFailed) {
      return (
        <Text style={{ color: Colors.danger }}>Fee estimation failed</Text>
      );
    }

    return <Loader />;
  }

  return (
    <SafeLayoutBottom>
      <TransferAmount
        token={transfer.token}
        decimalAmount={toDecimalAmount(transfer.token, transfer.intAmount)}
      />

      <View style={{ flex: 1 }}>
        <OptionGroup>
          <Option label="To">
            <Text>{trimAddress(transfer.recipient)}</Text>
          </Option>
          <Option label="Network fee">{getFeeElement()}</Option>
        </OptionGroup>

        {fee && !hasFundsForFee && (
          <Text
            style={{ color: Colors.danger, textAlign: "center", marginTop: 20 }}
          >
            Not enough SEI for fee.
          </Text>
        )}
      </View>

      <PrimaryButton
        title="Send"
        onPress={send}
        disabled={!fee || !hasFundsForFee}
      />
    </SafeLayoutBottom>
  );
}
