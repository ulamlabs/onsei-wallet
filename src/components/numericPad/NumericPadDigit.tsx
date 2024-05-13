import { Colors } from "@/styles";
import { TagCross } from "iconsax-react-native";
import { StyleProp, TouchableHighlight, View, ViewStyle } from "react-native";
import { Text } from "../typography";
import { NumericPadStyle } from "./types";

export type NumericPadDigitProps = {
  digit: string;
  showDot?: boolean;
  onPress: (digit: string) => void;
  style: NumericPadStyle;
};

export default function NumericPadDigit({
  digit,
  onPress,
  showDot,
  style,
}: NumericPadDigitProps) {
  const viewStyle: StyleProp<ViewStyle> = {
    borderRadius: style === "default" ? 100 : 10,
    height: style === "default" ? 70 : 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      style === "default" || digit === "." || digit === "X"
        ? "transparent"
        : Colors.background200,
    flex: 1,
  };

  if (digit === "." && !showDot) {
    return <View style={viewStyle} />;
  }

  return (
    <TouchableHighlight
      onPress={() => onPress(digit)}
      style={viewStyle}
      underlayColor="black"
    >
      {digit === "X" ? (
        <TagCross color={Colors.text} />
      ) : (
        <Text style={{ fontSize: 30 }}>{digit}</Text>
      )}
    </TouchableHighlight>
  );
}
