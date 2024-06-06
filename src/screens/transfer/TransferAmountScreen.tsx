import {
  Column,
  Loader,
  NumericPad,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  SmallButton,
  TextInput,
} from "@/components";
import { useGasPrice, useInputState } from "@/hooks";
import {
  estimateTransferFeeWithGas,
  estimateTransferGas,
} from "@/services/cosmos/tx";
import { useTokensStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatFee, parseAmount } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { StdFee } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import TransferAmount from "./TransferAmount";

type TransferAmountScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferAmount"
>;

export default function TransferAmountScreen({
  navigation,
  route,
}: TransferAmountScreenProps) {
  const [decimalAmount, setDecimalAmount] = useState("");
  const { tokenMap, updateBalances } = useTokensStore();
  const { tokenId, recipient } = route.params;
  const memoInput = useInputState();
  const [estimationFailed, setEstimationFailed] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);
  const [fee, setFee] = useState<StdFee | null>(null);
  const [gas, setGas] = useState(0);
  const { gasPrice } = useGasPrice();

  useEffect(() => {
    if (!decimalAmount) {
      return;
    }
    setLoadingFee(true);
    setFee(null);
    setEstimationFailed(false);

    const id = setTimeout(async () => {
      await feeEstimation();
    }, 1500);

    return () => {
      clearTimeout(id);
    };
  }, [decimalAmount]);

  useEffect(() => {
    return () => {
      setFee(null);
      setGas(0);
    };
  }, []);

  useEffect(() => {
    navigation.setParams({ gas });
  }, [gas]);

  useEffect(() => {
    setFee(estimateTransferFeeWithGas(gasPrice, gas));
  }, [gasPrice]);

  const feeInt = useMemo(() => {
    if (fee) {
      return BigInt(fee.amount[0].amount);
    }
    return 0n;
  }, [fee]);

  const token = useMemo(() => tokenMap.get(tokenId)!, [tokenId, tokenMap]);

  const intAmount = useMemo(
    () => parseAmount(decimalAmount, token.decimals),
    [decimalAmount],
  );

  const hasFunds = useMemo(() => {
    return token.balance >= intAmount;
  }, [intAmount]);

  function goToSummary() {
    navigation.navigate("transferSummary", {
      tokenId,
      recipient,
      intAmount: intAmount.toString(),
      memo: memoInput.value,
    });
  }

  function onMax() {
    setDecimalAmount(
      formatAmount(token.balance, token.decimals, {
        noDecimalSeparator: true,
      }),
    );
  }

  function onDigit(digit: string) {
    if (decimalAmount.includes(".")) {
      // Disallow second dot.
      if (digit === ".") {
        return;
      }

      // Disallow more decimals than the token allows.
      const decimals = decimalAmount.split(".")[1].length;
      if (decimals >= token.decimals) {
        return;
      }
    }

    // Disallow only zeros.
    if (digit === "0" && decimalAmount === "0") {
      return;
    }

    setDecimalAmount(decimalAmount + digit);
  }

  function onDelete() {
    setDecimalAmount(decimalAmount.slice(0, decimalAmount.length - 1));
  }

  if (!token) {
    // Happens when sending max amount of a native token. The token is no longer available.
    return <></>;
  }

  async function feeEstimation() {
    await estimateTransferGas(recipient.address, token, intAmount)
      .then(setGas)
      .catch(() => setEstimationFailed(true))
      .finally(() => setLoadingFee(false));
    setFee(estimateTransferFeeWithGas(gasPrice, gas));
  }

  function getFeeElement() {
    if (fee) {
      return (
        <Paragraph>
          {token.price
            ? formatFee(feeInt, token)
            : formatAmount(feeInt, token.decimals)}
        </Paragraph>
      );
    }

    if (estimationFailed) {
      return (
        <Paragraph style={{ color: Colors.danger }}>
          Fee estimation failed
        </Paragraph>
      );
    }
    if (loadingFee) {
      return <Loader size="small" />;
    }

    return <Paragraph>$0.00</Paragraph>;
  }

  function refershFn() {
    updateBalances();
    feeEstimation();
  }

  return (
    <SafeLayout refreshFn={refershFn}>
      <Column style={{ flex: 1, gap: 24 }}>
        <Row style={{ alignItems: "center" }}>
          <Paragraph style={{ fontFamily: FontWeights.regular, fontSize: 16 }}>
            Balance: {formatAmount(token.balance, token.decimals)}{" "}
            {token.symbol}
          </Paragraph>
          <SmallButton title="Max" onPress={onMax} />
        </Row>
        <Column
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TransferAmount
            style={{ flex: 0 }}
            token={token}
            decimalAmount={decimalAmount}
            error={!hasFunds}
          />
          <Paragraph>Network fee: {getFeeElement()}</Paragraph>
        </Column>

        <Column>
          <TextInput
            autoCorrect={false}
            placeholder="Add memo (optional)"
            {...memoInput}
          />
          <PrimaryButton
            title="Go to summary"
            onPress={goToSummary}
            disabled={!intAmount || !hasFunds || loadingFee}
          />
        </Column>

        <NumericPad
          showDot={true}
          onDigit={onDigit}
          onDelete={onDelete}
          style="condensed"
        />
      </Column>
    </SafeLayout>
  );
}
