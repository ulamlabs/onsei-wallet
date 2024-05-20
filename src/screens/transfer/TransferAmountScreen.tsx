import {
  Box,
  Column,
  NumericPad,
  PrimaryButton,
  Row,
  SecondaryButton,
  Text,
  SafeLayout,
} from "@/components";
import { useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { toDecimalAmount, toIntAmount, trimAddress } from "@/utils";
import { formatTokenAmount } from "@/utils/formatAmount";
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
  const [token, setToken] = useState(route.params.token);
  const { updateBalances, tokenMap } = useTokensStore();
  const { recipient } = route.params;

  const intAmount = useMemo(
    () => toIntAmount(token, decimalAmount),
    [decimalAmount],
  );

  const hasFunds = useMemo(() => {
    return Number(token.balance) >= (Number(intAmount) || 0);
  }, [intAmount]);

  const numberAmount = useMemo(() => Number(intAmount), [intAmount]);

  useEffect(() => {
    setToken({ ...token, balance: tokenMap.get(token.id)!.balance });
  }, [tokenMap]);

  function goToSummary() {
    navigation.navigate("transferSummary", {
      token,
      recipient,
      intAmount,
    });
  }

  function onMax() {
    setDecimalAmount(toDecimalAmount(token, token.balance));
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

  return (
    <SafeLayout refreshFn={updateBalances}>
      <Column style={{ flex: 1, gap: 24 }}>
        <Box>
          <Text style={{ color: Colors.text100 }}>To: </Text>
          <Text>{trimAddress(recipient)}</Text>
        </Box>

        <TransferAmount token={token} decimalAmount={decimalAmount} />

        {!hasFunds && (
          <Text style={{ color: Colors.danger, textAlign: "center" }}>
            Insufficient funds
          </Text>
        )}

        <Row style={{ alignItems: "center" }}>
          <Column>
            <Text style={{ color: Colors.text100, fontSize: 12 }}>
              Available to send:
            </Text>
            <Text style={{ fontFamily: "bold", fontSize: 16 }}>
              {formatTokenAmount(token.balance, token.decimals)} {token.symbol}
            </Text>
          </Column>
          <SecondaryButton title="Max" onPress={onMax} />
        </Row>

        <PrimaryButton
          title="Go to summary"
          onPress={goToSummary}
          disabled={!numberAmount || !hasFunds}
        />

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
