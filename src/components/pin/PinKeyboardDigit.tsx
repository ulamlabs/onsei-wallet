import { Colors } from "@/styles";
import { TagCross } from "iconsax-react-native";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "../typography";

export type PinKeyboardDigitProps = {
  digit: string;
  onPress: (digit: string) => void;
};

export default function PinKeyboardDigit({
  digit,
  onPress,
}: PinKeyboardDigitProps) {
  if (!digit) {
    return <View style={styles.digit} />;
  }

  return (
    <TouchableHighlight
      onPress={() => onPress(digit)}
      style={styles.digit}
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

const styles = StyleSheet.create({
  digit: {
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
