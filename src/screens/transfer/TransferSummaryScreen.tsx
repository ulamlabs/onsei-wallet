import {
  Loader,
  NetworkFeeInfo,
  Option,
  OptionGroup,
  SafeLayout,
  SwipeButton,
  Text,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { useGas } from "@/modules/gas";
import { estimateTransferFee } from "@/services/cosmos/tx";
import { useFeeStore, useSettingsStore, useTokensStore } from "@/store";
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
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const {
    settings: { node },
  } = useSettingsStore();
  const { selectedGasPrice } = useFeeStore();
  const { data: gasData } = useGas();
  const networkName = NETWORK_NAMES[node] as "pacific-1" | "atlantic-2";
  const minGasPrice = gasData?.[networkName].min_gas_price;
  const gas = minGasPrice
    ? `${minGasPrice * selectedGasPrice.multiplier}usei`
    : "0.1usei";

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
    estimateTransferFee(transfer.recipient.address, token, intAmount, gas)
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

    return <Loader size="medium" />;
  }

  return (
    <SafeLayout refreshFn={getFeeEstimation} scrollEnabled={scrollEnabled}>
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
