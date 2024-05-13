import { View } from "react-native";
import NumericPadDigit from "./NumericPadDigit";
import { NumericPadStyle } from "./types";

const DIGITS_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "X"],
];

export type NumericPadProps = {
  showDot?: boolean;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  style?: NumericPadStyle;
};

export default function NumericPad({
  onDigit,
  onDelete,
  showDot,
  style = "default",
}: NumericPadProps) {
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
    <View style={{ gap: style === "default" ? 30 : 6 }}>
      {DIGITS_ROWS.map((digits, index) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            gap: 6,
          }}
          key={index}
        >
          {digits.map((digit) => (
            <NumericPadDigit
              digit={digit}
              onPress={onPress}
              key={digit}
              showDot={showDot}
              style={style}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
