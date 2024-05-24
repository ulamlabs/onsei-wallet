import {
  Loader,
  Option,
  OptionGroup,
  SafeLayout,
  SwipeButton,
  Text,
} from "@/components";
import { estimateTransferFee } from "@/services/cosmos/tx";
import { useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatAmount, trimAddress } from "@/utils";
import { StdFee } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import TransferAmount from "./TransferAmount";

type TransferSummaryScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSummary"
>;

export default function TransferSummaryScreen({
  navigation,
  route,
}: TransferSummaryScreenProps) {
  const transfer = route.params;
  const { sei, updateBalances, tokenMap } = useTokensStore();
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

    updateBalances([sei]);
    estimateTransferFee(transfer.recipient.address, token, intAmount)
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
            <Text>
              {transfer.recipient.name} (
              {trimAddress(transfer.recipient.address)})
            </Text>
          </Option>
          {transfer.memo && (
            <Option label="Network fee">
              <Text>{transfer.memo}</Text>
            </Option>
          )}
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

      <SwipeButton />
    </SafeLayout>
  );
}
