import {
  Loader,
  NetworkFeeInfo,
  Option,
  OptionGroup,
  SafeLayout,
  SwipeButton,
  Text,
} from "@/components";
import { useGasPrice } from "@/hooks";
import { estimateTransferFee } from "@/services/cosmos/tx";
import { useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatAmount, formatFee, trimAddress } from "@/utils";
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
  const [estimationFailed, setEstimationFailed] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [fee, setFee] = useState<StdFee | null>(null);

  const { gasPrice } = useGasPrice();

  useEffect(() => {
    feeEstimation();
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

  function feeEstimation() {
    setFee(null);
    setEstimationFailed(false);

    updateBalances([sei]);
    estimateTransferFee(transfer.recipient.address, token, intAmount, gasPrice)
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
          {token.price
            ? formatFee(feeInt, token)
            : formatAmount(feeInt, token.decimals)}
        </Text>
      );
    }

    if (estimationFailed) {
      return (
        <Text style={{ color: Colors.danger }}>Fee estimation failed</Text>
      );
    }

    return <Loader size="medium" />;
  }

  return (
    <SafeLayout refreshFn={feeEstimation} scrollEnabled={scrollEnabled}>
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
            <Option label="Memo">
              <Text>{transfer.memo}</Text>
            </Option>
          )}
          <Option label={<NetworkFeeInfo />}>{getFeeElement()}</Option>
        </OptionGroup>

        {fee && !hasFundsForFee && (
          <Text
            style={{ color: Colors.danger, textAlign: "center", marginTop: 20 }}
          >
            Not enough SEI for fee.
          </Text>
        )}
      </View>
      <SwipeButton
        onSuccess={send}
        disabled={!fee || !hasFundsForFee}
        setScrolling={setScrollEnabled}
      />
    </SafeLayout>
  );
}
