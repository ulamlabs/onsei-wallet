import {
  Column,
  NumericPad,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  SmallButton,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { useTokensStore } from "@/store";
import { FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { parseAmount } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
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

  return (
    <SafeLayout refreshFn={updateBalances}>
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
          <Paragraph>
            Network fee: {decimalAmount ? "<$0.01" : "$0.00"}
          </Paragraph>
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
            disabled={!intAmount || !hasFunds}
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
