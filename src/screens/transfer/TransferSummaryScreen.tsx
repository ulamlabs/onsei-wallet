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
import { simulateEvmTx } from "@/services/evm/tx";
import { useAccountsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { checkFundsForFee, formatAmount, trimAddress } from "@/utils";
import { StdFee } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { isAddress as isEvmAddress } from "viem";
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
  const { activeAccount, getMnemonic } = useAccountsStore();

  const { gasPrice } = useGasPrice();

  useEffect(() => {
    setFee(transfer.fee || null);
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
    return checkFundsForFee(
      fee,
      sei.balance,
      transfer.tokenId,
      sei.id,
      intAmount,
    );
  }, [fee, sei.balance]);

  function feeEstimation() {
    setFee(null);
    setEstimationFailed(false);

    updateBalances([sei]);

    if (isEvmAddress(transfer.recipient.address)) {
      simulateEvmTx(
        getMnemonic(activeAccount!.address!),
        transfer.recipient.address as `0x${string}`,
        intAmount,
        token,
        transfer.decimalAmount || "0",
        transfer.memo || "",
      )
        .then((simulation) => setFee(simulation.stdFee))
        .catch(() => setEstimationFailed(true));
      return;
    }

    estimateTransferFee(transfer.recipient.address, token, intAmount, gasPrice)
      .then(setFee)
      .catch(() => setEstimationFailed(true));
  }

  function handleSwipeCompleted() {
    if (!fee) {
      return;
    }
    navigation.navigate("transferSending", { ...transfer, fee });
  }

  function getFeeElement() {
    if (fee) {
      return (
        <Text testID="network-fee">
          {formatAmount(feeInt, sei.decimals)} SEI
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
        title="Swipe to send"
        onSuccess={handleSwipeCompleted}
        disabled={!fee || !hasFundsForFee}
        setScrolling={setScrollEnabled}
      />
    </SafeLayout>
  );
}
