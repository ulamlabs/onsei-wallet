import { Colors } from "@/styles";
import ReactNative from "react-native";

export default function TextInput({
  style,
  ...props
}: ReactNative.TextInputProps) {
  return (
    <ReactNative.TextInput
      placeholderTextColor={Colors.text200}
      {...props}
      style={[
        {
          borderRadius: 18,
          borderWidth: 1,
          borderColor: Colors.inputBorderColor,
          padding: 16,
          backgroundColor: Colors.background100,
          color: Colors.text,
        },
        style,
      ]}
    />
  );
}
