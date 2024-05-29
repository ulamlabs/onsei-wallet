import { Colors, FontSizes, FontWeights } from "@/styles";
import { CloseCircle, Icon } from "iconsax-react-native";
import { useRef, useState } from "react";
import ReactNative, { Pressable, View } from "react-native";
import { Text } from "../typography";

type TextInputProps = ReactNative.TextInputProps & {
  label?: string;
  icon?: Icon;
  showClear?: boolean;
  error?: boolean;
};

export default function TextInput({
  showClear,
  style,
  onChangeText,
  value,
  label,
  icon: Icon,
  error,
  ...props
}: TextInputProps) {
  const view = useRef<ReactNative.View>(null);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
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

  function onLayout() {
    view.current?.measure((x, y, width) => {
      if (width > 0) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setVisible(false);
      }
    });
  }

  return (
    <View ref={view} style={{ justifyContent: "center" }} onLayout={onLayout}>
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
                ? Colors.activeTextInputBorderColor
                : Colors.inputBorderColor,
            backgroundColor: Colors.background100,
            paddingRight: showClear && !!value?.length ? 55 : 16,
            paddingLeft: Icon ? 42 : 16,
          },
          style,
        ]}
      >
        {visible && (
          <ReactNative.TextInput
            placeholderTextColor={Colors.text100}
            onChangeText={onChangeText}
            value={value}
            style={{ paddingVertical: 16, color: Colors.text }}
            {...props}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
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
