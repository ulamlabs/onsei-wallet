import { Colors } from "@/styles";
import { CloseCircle } from "iconsax-react-native";
import { useState } from "react";
import ReactNative, { Pressable, View } from "react-native";

type TextInputProps = ReactNative.TextInputProps & {
  showClear?: boolean;
  error?: boolean;
};

export default function TextInput({
  showClear,
  style,
  onChangeText,
  value,
  error,
  ...props
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  function clear() {
    if (onChangeText) {
      onChangeText("");
    }
  }

  function onFocus() {
    setFocused(true);
  }

  function onBlur() {
    setFocused(false);
  }

  return (
    <View style={{ justifyContent: "center" }}>
      <ReactNative.TextInput
        placeholderTextColor={Colors.text300}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        {...props}
        style={[
          {
            borderRadius: 18,
            borderWidth: 1,
            borderColor: error
              ? Colors.danger
              : focused
                ? Colors.activeTextInputBorderColor
                : Colors.inputBorderColor,
            padding: 16,
            backgroundColor: Colors.background300,
            color: Colors.text,
            paddingRight: showClear ? 55 : 16,
          },
          style,
        ]}
      />
      {showClear && !!value?.length && (
        <Pressable style={{ position: "absolute", right: 16 }} onPress={clear}>
          <CloseCircle variant="Bold" color={Colors.text100} />
        </Pressable>
      )}
    </View>
  );
}
