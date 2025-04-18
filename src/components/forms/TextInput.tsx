import { Colors, FontSizes, FontWeights } from "@/styles";
import { CloseCircle, Icon } from "iconsax-react-native";
import { useState } from "react";
import ReactNative, {
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../typography";

type TextInputProps = ReactNative.TextInputProps & {
  label?: string;
  icon?: Icon;
  showClear?: boolean;
  error?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TextInput({
  showClear,
  style,
  onChangeText,
  value,
  label,
  icon: Icon,
  error,
  containerStyle,
  ...props
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  function clear() {
    if (onChangeText) {
      onChangeText("");
    }
  }

  function onFocus(
    e: ReactNative.NativeSyntheticEvent<ReactNative.TextInputFocusEventData>,
  ) {
    setFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  }

  function onBlur(
    e: ReactNative.NativeSyntheticEvent<ReactNative.TextInputFocusEventData>,
  ) {
    setFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  }

  return (
    <View style={[{ justifyContent: "center" }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontFamily: FontWeights.bold,
            fontSize: FontSizes.base,
            marginBottom: 10,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          {
            justifyContent: "center",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: error
              ? Colors.danger
              : focused
                ? Colors.markerBackground
                : Colors.inputBorderColor,
            backgroundColor: Colors.background100,
            paddingRight: showClear && !!value?.length ? 55 : 16,
            paddingLeft: Icon ? 42 : 16,
          },
          style,
        ]}
      >
        <ReactNative.TextInput
          testID={label ? `${label}-input` : "input"}
          placeholderTextColor={Colors.text100}
          onChangeText={onChangeText}
          value={value}
          style={{ paddingVertical: 16, color: Colors.text }}
          {...props}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {Icon && (
          <Icon
            size={16}
            style={{ position: "absolute", left: 16 }}
            color={Colors.text100}
          />
        )}
        {showClear && !!value?.length && (
          <Pressable
            style={{ position: "absolute", right: 16 }}
            onPress={clear}
          >
            <CloseCircle variant="Bold" color={Colors.text100} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
