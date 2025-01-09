import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { StyleSheet } from "react-native";

type Props = {
  amount?: string;
};

export function Amount({ amount = "0" }: Props) {
  return <Text style={styles.amount}>{amount}</Text>;
}

const fontSize = FontSizes.xl;

const styles = StyleSheet.create({
  amount: {
    color: Colors.text100,
    fontSize: fontSize,
    fontFamily: FontWeights.bold,
    lineHeight: fontSize * 1.2,
  },
});
