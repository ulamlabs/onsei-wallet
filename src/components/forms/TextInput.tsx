import { Colors } from "@/styles";
import { CloseSquare } from "iconsax-react-native";
import ReactNative, { Pressable, View } from "react-native";

type TextInputProps = ReactNative.TextInputProps & {
  showClear?: boolean;
};

export default function TextInput({
  showClear,
  style,
  onChangeText,
  value,
  ...props
}: TextInputProps) {
  function clear() {
    if (onChangeText) {
      onChangeText("");
    }
  }

  return (
    <View style={{ justifyContent: "center" }}>
      <ReactNative.TextInput
        placeholderTextColor={Colors.text300}
        onChangeText={onChangeText}
        value={value}
        {...props}
        style={[
          {
            borderRadius: 18,
            borderWidth: 1,
            borderColor: Colors.inputBorderColor,
            padding: 16,
            backgroundColor: Colors.background100,
            color: Colors.text,
            paddingRight: showClear ? 55 : 16,
          },
          style,
        ]}
      />
      {showClear && !!value?.length && (
        <Pressable style={{ position: "absolute", right: 16 }} onPress={clear}>
          <CloseSquare color={Colors.text} />
        </Pressable>
      )}
    </View>
  );
}
