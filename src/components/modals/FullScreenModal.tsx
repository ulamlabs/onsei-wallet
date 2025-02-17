import { Colors, FontSizes, FontWeights } from "@/styles";
import { PropsWithChildren, useRef, useEffect, useState } from "react";
import {
  Modal as ReactModal,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  GestureResponderEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { More } from "iconsax-react-native";
import { Text } from "@/components";
import XIcon from "@/components/XIcon";
import { Dropdown, DropdownOption } from "../Dropdown";

type FullScreenModalProps<T> = PropsWithChildren<{
  isVisible: boolean;
  onBackdropPress?: () => void;
  title?: string;
  moreOptions?: DropdownOption<T>[];
}>;

export default function FullScreenModal<T>({
  isVisible,
  children,
  onBackdropPress,
  title,
  moreOptions,
}: FullScreenModalProps<T>) {
  const moreButtonRef = useRef<TouchableOpacity>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const insets = useSafeAreaInsets();
  const pan = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(pan, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    }
  }, [isVisible, pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(pan, {
            toValue: 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowMoreOptions(false);
            setTimeout(() => {
              onBackdropPress?.();
            }, 50);
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
        }
      },
    }),
  ).current;

  const handleMorePress = (e: GestureResponderEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreOptions((prev) => !prev);
  };

  return (
    <ReactModal
      visible={isVisible}
      supportedOrientations={["landscape", "portrait"]}
      animationType="none"
      transparent={true}
      onRequestClose={() => {
        setShowMoreOptions(false);
        onBackdropPress?.();
      }}
      statusBarTranslucent={true}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: pan }],
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.header}>
            <TouchableOpacity
              onPress={onBackdropPress}
              style={styles.closeButton}
            >
              <XIcon color={Colors.text} size={32} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            {moreOptions?.length && (
              <View style={styles.moreOptionsContainer}>
                <TouchableOpacity
                  onPress={handleMorePress}
                  style={styles.moreOptionsButton}
                  ref={moreButtonRef}
                  activeOpacity={0.7}
                >
                  <More color={Colors.text} size={28} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.childrenContainer}>{children}</View>
        </Animated.View>
        {moreOptions?.length && (
          <Dropdown
            visible={showMoreOptions}
            isPortal={false}
            onClose={() => setShowMoreOptions(false)}
            onSelect={(value) => {
              const selectedOption = moreOptions?.find(
                (option) => option.value === value,
              );
              selectedOption?.onPress?.();
              setShowMoreOptions(false);
            }}
            options={moreOptions}
            buttonRef={moreButtonRef}
          />
        )}
      </View>
    </ReactModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "space-between",
    gap: 24,
    backgroundColor: Colors.background100,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: Colors.inputBorderColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  closeButton: {
    flex: 0,
    alignItems: "flex-start",
  },
  moreOptionsButton: {
    flex: 0,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.lg,
    lineHeight: 21.6,
    letterSpacing: 0,
    color: Colors.text,
  },
  childrenContainer: {
    flex: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.inputBorderColor,
  },
  moreOptionsContainer: {
    position: "relative",
    zIndex: 2000,
  },
});
