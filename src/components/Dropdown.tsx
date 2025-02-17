import React, { useRef } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { APP_HORIZONTAL_PADDING } from "@/const";
import { Portal } from "react-native-paper";
import { AnchorPosition, useAnchorPosition } from "@/hooks/useAnchorPosition";

export type DropdownOption<T> = {
  label: string;
  value: T;
  onPress?: () => void;
  disabled?: boolean;
};

type DropdownContentProps<T> = {
  options: DropdownOption<T>[];
  buttonRef: React.RefObject<View>;
  value?: T;
  align?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  onClose: () => void;
  onSelect: (value: T) => void;
  disabled?: boolean;
  anchorPosition: AnchorPosition;
};

type DropdownProps<T> = {
  isPortal?: boolean;
  visible: boolean;
} & Omit<DropdownContentProps<T>, "anchorPosition">;

export function Dropdown<T>({
  visible,
  isPortal = true,
  ...restProps
}: DropdownProps<T>) {
  const anchorPosition = useAnchorPosition({
    ref: restProps.buttonRef,
    visible,
    offsetY: 10,
  });

  if (!visible || !anchorPosition) {
    return null;
  }

  if (isPortal) {
    return (
      <Portal>
        <DropdownContent {...restProps} anchorPosition={anchorPosition} />
      </Portal>
    );
  }

  return <DropdownContent {...restProps} anchorPosition={anchorPosition} />;
}

function DropdownContent<T>({
  options,
  value,
  align = "right",
  style,
  onClose,
  onSelect,
  disabled,
  anchorPosition,
}: DropdownContentProps<T>) {
  const dropdownRef = useRef<View>(null);

  function handleOptionPress(
    e: GestureResponderEvent,
    option: DropdownOption<T>,
  ) {
    e.stopPropagation();
    if (disabled || option.disabled) {
      return;
    }
    onSelect(option.value);
    onClose();
  }

  return (
    <TouchableOpacity
      style={StyleSheet.absoluteFill}
      activeOpacity={1}
      onPress={onClose}
    >
      <View
        ref={dropdownRef}
        style={[
          styles.dropdownContainer,
          {
            position: "absolute",
            top: anchorPosition.y,
            [align]: APP_HORIZONTAL_PADDING,
          },
          style,
        ]}
      >
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={styles.dropdownItem}
              onPress={(e) => handleOptionPress(e, option)}
              disabled={disabled || option.disabled}
            >
              <Text
                style={[
                  styles.dropdownText,
                  {
                    color: isActive ? Colors.markerBackground : Colors.text,
                    textAlign: align,
                  },
                  (disabled || option.disabled) && styles.disabledText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: Colors.background100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorderColor,
    minWidth: 150,
    shadowColor: Colors.background,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    zIndex: 2001,
  },
  dropdownItem: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  dropdownText: {
    color: Colors.text,
    fontSize: FontSizes.base,
    fontFamily: FontWeights.bold,
    lineHeight: 24,
    letterSpacing: 0,
  },
  disabledText: {
    color: Colors.disabledButtonText,
  },
});
