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
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { parseAmount, trimAddress } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import TransferAmount from "./TransferAmount";
import { useTokensStore } from "@/store";

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
            <Text style={{ fontFamily: FontWeights.bold, fontSize: 16 }}>
              {formatAmount(token.balance, token.decimals)} {token.symbol}
            </Text>
          </Column>
          <SecondaryButton title="Max" onPress={onMax} />
        </Row>

        <PrimaryButton
          title="Go to summary"
          onPress={goToSummary}
          disabled={!intAmount || !hasFunds}
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
