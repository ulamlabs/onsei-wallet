import { Back } from "iconsax-react-native";
import { Text, StyleSheet, TouchableHighlight, View } from "react-native";

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
      underlayColor="#888"
    >
      {digit === "X" ? (
        <Back color="white" />
      ) : (
        <Text style={{ fontSize: 30, color: "white" }}>{digit}</Text>
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
