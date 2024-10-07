import { Colors } from "@/styles";
import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import { Path, Svg } from "react-native-svg";

type Props = {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
};

export default function Checkbox({ checked, setChecked }: Props) {
  function toggleCheck() {
    setChecked((prevValue) => !prevValue);
  }
  return (
    <TouchableOpacity onPress={toggleCheck}>
      <View
        style={[
          {
            width: 22,
            height: 22,
            borderRadius: 6,
            borderColor: Colors.text,
            borderWidth: 1,
            backgroundColor: checked ? Colors.text : Colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {checked && (
          <Svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <Path
              d="M1.21143 5.00001L4.73292 8.5215L11.7883 1.47852"
              stroke={Colors.inputBorderColor}
              strokeWidth="1.86652"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
    </TouchableOpacity>
  );
}
