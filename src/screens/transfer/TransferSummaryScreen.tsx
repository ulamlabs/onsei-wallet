import {
  Loader,
  Option,
  OptionGroup,
  PrimaryButton,
  SafeLayout,
  Text,
} from "@/components";
import TransferAmount from "./TransferAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { View } from "react-native";
import { useTokensStore } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { estimateTransferFee } from "@/services/cosmos/tx";
import { StdFee } from "@cosmjs/stargate";
import { Colors } from "@/styles";
import { formatAmount } from "@/utils";

type TransferSummaryScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSummary"
>;

export default function TransferSummaryScreen({
  navigation,
  route,
}: TransferSummaryScreenProps) {
  const transfer = route.params;
  const { sei, updateBalance, tokenMap } = useTokensStore();
  const [fee, setFee] = useState<StdFee | null>(null);
  const [estimationFailed, setEstimationFailed] = useState(false);

  useEffect(() => {
    getFeeEstimation();
  }, []);

  const token = useMemo(
    () => tokenMap.get(transfer.tokenId)!,
    [transfer.tokenId],
  );

  const intAmount = useMemo(
    () => BigInt(transfer.intAmount),
    [transfer.intAmount],
  );

  const feeInt = useMemo(() => {
    if (fee) {
      return BigInt(fee.amount[0].amount);
    }
    return 0n;
  }, [fee]);

  const hasFundsForFee = useMemo(() => {
    if (!fee) {
      return false;
    }
    let seiLeft = sei.balance - feeInt;
    if (token.id === sei.id) {
      seiLeft -= intAmount;
    }
    return seiLeft >= 0;
  }, [fee, sei.balance]);

  function getFeeEstimation() {
    setFee(null);
    setEstimationFailed(false);

    updateBalance(sei);
    estimateTransferFee(transfer.recipient, token, intAmount)
      .then(setFee)
      .catch(() => setEstimationFailed(true));
  }

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
          {formatAmount(feeInt, sei.decimals)} {sei.symbol}
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
    <SafeLayout refreshFn={getFeeEstimation}>
      <TransferAmount
        token={token}
        decimalAmount={formatAmount(intAmount, token.decimals, {
          noDecimalSeparator: true,
        })}
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
    </SafeLayout>
  );
}
