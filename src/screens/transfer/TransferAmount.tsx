import { Row, Text } from "@/components";
import { CosmToken } from "@/services/cosmos";
import { Colors, FontWeights } from "@/styles";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

type TransferAmountProps = {
  token: CosmToken;
  decimalAmount: string;
};

export default function TransferAmount({
  token,
  decimalAmount,
}: TransferAmountProps) {
  const formattedAmount = useMemo(() => {
    const [whole, fraction] = decimalAmount.split(".");
    const wholeFormatted = Number(whole).toLocaleString("en-US");
    if (decimalAmount.includes(".")) {
      return `${wholeFormatted}.${fraction}`;
    }
    return wholeFormatted;
  }, [decimalAmount]);

  function getContent() {
    if (decimalAmount) {
      return (
        <Text style={styles.text} adjustsFontSizeToFit={true} numberOfLines={1}>
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
    <Row
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      {getContent()}
    </Row>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontFamily: FontWeights.bold,
    textAlign: "center",
  },
});
