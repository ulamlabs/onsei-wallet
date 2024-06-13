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
import { getSigningClientAndSender } from "@/services/cosmos/tx/getSigningClientAndSender";
import { useTokensStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { checkFundsForFee, parseAmount } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { SigningStargateClient, StdFee } from "@cosmjs/stargate";
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
  const { tokenMap, updateBalances, sei } = useTokensStore();
  const { tokenId, recipient } = route.params;
  const memoInput = useInputState();
  const [estimationFailed, setEstimationFailed] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);
  const [fee, setFee] = useState<StdFee | null>(null);
  const [gas, setGas] = useState(0);
  const { gasPrice } = useGasPrice();
  const [loadingMaxAmount, setLoadingMaxAmount] = useState(false);
  const [signingClientAndSender, setSigningClientAndSender] = useState<
    [SigningStargateClient, string] | undefined
  >(undefined);

  const token = useMemo(() => tokenMap.get(tokenId)!, [tokenId, tokenMap]);

  useEffect(() => {
    getSigningClientAndSender()
      .then((data) => {
        setSigningClientAndSender(data);
      })
      .catch(console.error);

    return () => {
      setFee(null);
      setGas(0);
    };
  }, []);

  const intAmount = useMemo(
    () => parseAmount(decimalAmount, token.decimals),
    [decimalAmount],
  );
  const hasFunds = useMemo(() => {
    return token.balance >= intAmount;
  }, [intAmount]);

  const feeInt = useMemo(() => {
    if (fee) {
      return BigInt(fee.amount[0].amount);
    }
    return 0n;
  }, [fee]);

  const hasFundsForFee = useMemo(() => {
    return checkFundsForFee(fee, sei.balance, tokenId, sei.id, intAmount);
  }, [fee, sei.balance, intAmount]);

  useEffect(() => {
    if (loadingMaxAmount) {
      return;
    }
    if (!decimalAmount || intAmount > token.balance) {
      setFee(null);
      setLoadingFee(false);
      return;
    }
    setLoadingFee(true);
    setFee(null);
    setEstimationFailed(false);

    const id = setTimeout(async () => {
      await feeEstimation();
    }, 700);

    return () => {
      clearTimeout(id);
    };
  }, [decimalAmount]);

  useEffect(() => {
    navigation.setParams({ gas });
  }, [gas]);

  useEffect(() => {
    if (!gas) {
      return;
    }
    setFee(estimateTransferFeeWithGas(gasPrice, gas));
  }, [gasPrice]);

  function goToSummary() {
    navigation.navigate("transferSummary", {
      tokenId,
      recipient,
      intAmount: intAmount.toString(),
      memo: memoInput.value,
      fee,
    });
  }

  async function onMax() {
    try {
      if (token.id !== sei.id) {
        setDecimalAmount(
          formatAmount(token.balance, token.decimals, {
            noDecimalSeparator: true,
          }),
        );
        return;
      }

      setLoadingMaxAmount(true);
      const fee = await feeEstimation(token.balance);
      if (!fee) {
        throw new Error("Fee estimation failed");
      }

      const feeInt = BigInt(fee.amount[0].amount);
      const maxAmount = token.balance - feeInt;
      setDecimalAmount(
        formatAmount(maxAmount, token.decimals, { noDecimalSeparator: true }),
      );
      setFee(fee);
    } catch (error) {
      setEstimationFailed(true);
    } finally {
      setLoadingMaxAmount(false);
    }
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

  async function feeEstimation(amount: bigint = intAmount) {
    try {
      const gas = await estimateTransferGas(
        recipient.address,
        token,
        amount,
        signingClientAndSender || undefined,
      );
      setGas(gas);
      const estimatedFee = estimateTransferFeeWithGas(gasPrice, gas);
      setFee(estimatedFee);
      return estimatedFee;
    } catch (error) {
      setEstimationFailed(true);
    } finally {
      setLoadingFee(false);
    }
  }
  function getFeeElement() {
    if (!hasFundsForFee && fee) {
      return (
        <Paragraph style={{ color: Colors.danger }}>
          Insufficient funds for fee
        </Paragraph>
      );
    }

    if (fee && decimalAmount) {
      return <Paragraph>{formatAmount(feeInt, sei.decimals)} SEI</Paragraph>;
    }

    if (estimationFailed) {
      return <Paragraph>-</Paragraph>;
    }
    if (loadingFee) {
      return <Loader size="small" />;
    }

    return <Paragraph>0 SEI</Paragraph>;
  }

  function refreshFn() {
    updateBalances();
    feeEstimation();
  }

  return (
    <SafeLayout refreshFn={refreshFn}>
      {!signingClientAndSender ? (
        <Row style={{ flex: 1, justifyContent: "center" }}>
          <Loader size="large" />
        </Row>
      ) : (
        <Column style={{ flex: 1, gap: 24 }}>
          <Row style={{ alignItems: "center" }}>
            <Paragraph
              style={{ fontFamily: FontWeights.regular, fontSize: 16 }}
            >
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
              loading={loadingMaxAmount}
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
              disabled={
                !intAmount || !hasFunds || loadingFee || !hasFundsForFee
              }
            />
          </Column>

          <NumericPad
            showDot={true}
            onDigit={onDigit}
            onDelete={onDelete}
            style="condensed"
          />
        </Column>
      )}
    </SafeLayout>
  );
}
