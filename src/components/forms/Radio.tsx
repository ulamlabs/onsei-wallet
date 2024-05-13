import { Pressable } from "react-native";
import { Row } from "../layout";
import PinDigit from "../pin/PinDigit";
import { Text } from "../typography";

type RadioProps<T extends string> = {
  label: T;
  isActive: boolean;
  onPress: (option: T) => void;
};

export default function Radio<T extends string>({
  label,
  isActive,
  onPress,
}: RadioProps<T>) {
  function onRadioPress() {
    if (isActive) {
      return;
    }
    onPress(label);
  }

  return (
    <Pressable style={{ marginVertical: 3 }} onPress={onRadioPress}>
      <Row>
        <Text>{label}</Text>
        <PinDigit filled={isActive} error={false} />
      </Row>
    </Pressable>
  );
}
