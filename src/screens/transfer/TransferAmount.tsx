import { Column, Loader, Paragraph, Row, Text } from "@/components";
import { CosmTokenWithBalance } from "@/services/cosmos";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatDecimalSeparator, formatUsdBalance } from "@/utils";
import { useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

type TransferAmountProps = {
  token: CosmTokenWithBalance;
  decimalAmount: string;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  loading?: boolean;
};

export default function TransferAmount({
  token,
  decimalAmount,
  style,
  error,
  loading,
}: TransferAmountProps) {
  const formattedAmount = useMemo(() => {
    const [whole, fraction] = decimalAmount.split(".");
    const wholeFormatted = formatDecimalSeparator(whole);
    if (decimalAmount.includes(".")) {
      return `${wholeFormatted}.${fraction}`;
    }
    return wholeFormatted;
  }, [decimalAmount]);

  function getContent() {
    if (loading) {
      return <Loader size="large" />;
    }
    if (decimalAmount) {
      return (
        <Text
          style={[{ color: error ? Colors.danger : Colors.text }, styles.text]}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {formattedAmount || 0} {token.symbol}
        </Text>
      );
    }

    return (
      <>
        <Text style={[styles.text, { color: Colors.text100 }]}>0</Text>
        <Text style={styles.text}>{token.symbol}</Text>
      </>
    );
  }

  return (
    <Column
      style={[
        { alignItems: "center", justifyContent: "center", flex: 1 },
        style,
      ]}
    >
      <Row>{getContent()}</Row>

      {token.price ? (
        <Paragraph size="lg">
          $
          {formatUsdBalance(
            token.price * +formattedAmount.replaceAll(",", ""),
          ) || 0}
        </Paragraph>
      ) : (
        <></>
      )}
      {error && (
        <Paragraph
          style={{
            color: Colors.danger,
            textAlign: "center",
            fontSize: FontSizes.base,
          }}
        >
          Insufficient funds
        </Paragraph>
      )}
    </Column>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontFamily: FontWeights.bold,
    textAlign: "center",
  },
});
