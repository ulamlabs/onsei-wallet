import { Colors, FontSizes, FontWeights } from "@/styles";
import { StyleSheet, TextInput } from "react-native";

const NUM_REGEX = /^(0*)((\d*)\.?(\d*))$/;

// TODO: should be props so that AmountInput is generic
const MAX_DIGITS = 8;
const MAX_INTEGER_DIGITS = 8;

type Props = {
  decimals: number;
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export function AmountInput({ decimals, id, value, onChange }: Props) {
  const validateAndChange = (newValue: string) => {
    newValue = newValue.replace(",", ".");

    if (newValue === "" || newValue === ".") {
      onChange(newValue);
      return;
    }

    const match = newValue.match(NUM_REGEX);

    if (!match) {
      return;
    }

    const [, zeroes, numberWithoutZeroes, integerPart, decimalPart] = match;

    // disallow leading zeroes, but:
    // allow "0"
    // allow "0.", "0.1", "0.14", etc
    // allow ".1", ".2512", etc
    const formattedNumber =
      zeroes && !integerPart ? `0${numberWithoutZeroes}` : numberWithoutZeroes;

    if (decimalPart.length > decimals) {
      return;
    }

    if (integerPart.length > MAX_INTEGER_DIGITS) {
      return;
    }

    if (integerPart.length + decimalPart.length > MAX_DIGITS) {
      return;
    }

    onChange(formattedNumber);
  };

  return (
    <TextInput
      id={id}
      keyboardType="numeric"
      placeholder="0"
      style={styles.input}
      value={value}
      onChangeText={validateAndChange}
    />
  );
}

const fontSize = FontSizes.xl;

const styles = StyleSheet.create({
  input: {
    color: Colors.text,
    fontSize: fontSize,
    fontFamily: FontWeights.bold,
    lineHeight: fontSize * 1.2,
  },
});
