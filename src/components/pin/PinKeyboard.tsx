import { View } from "react-native";
import PinKeyboardDigit from "./PinKeyboardDigit";

const DIGITS_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "X"],
];

export type PinKeyboardProps = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
};

export default function PinKeyboard({ onDigit, onDelete }: PinKeyboardProps) {
  function onPress(symbol: string) {
    if (symbol === "") {
      return;
    }
    if (symbol === "X") {
      onDelete();
    } else {
      onDigit(symbol);
    }
  }

  return (
    <View style={{ gap: 30 }}>
      {DIGITS_ROWS.map((digits, index) => (
        <View style={{ flexDirection: "row", gap: 40 }} key={index}>
          {digits.map((digit) => (
            <PinKeyboardDigit digit={digit} onPress={onPress} key={digit} />
          ))}
        </View>
      ))}
    </View>
  );
}
