import { Colors, FontSizes, FontWeights } from "@/styles";
import {
  PropsWithChildren,
  useRef,
  useEffect,
  useState,
  useCallback,
  RefObject,
} from "react";
import {
  Modal as ReactModal,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  GestureResponderEvent,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { More } from "iconsax-react-native";
import { CloseIcon, Text } from "@/components";
import { Dropdown, DropdownOption } from "../Dropdown";

const ANIMATION_CONFIG = {
  SPRING: {
    damping: 20,
    stiffness: 90,
  },
  TIMING: {
    duration: 200,
  },
  DISMISS_THRESHOLD: 100,
  INITIAL_POSITION: 800,
} as const;

const useModalPanResponder = (pan: Animated.Value, onClose: () => void) => {
  return useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > ANIMATION_CONFIG.DISMISS_THRESHOLD) {
          Animated.timing(pan, {
            toValue: ANIMATION_CONFIG.INITIAL_POSITION,
            duration: ANIMATION_CONFIG.TIMING.duration,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            ...ANIMATION_CONFIG.SPRING,
          }).start();
        }
      },
    }),
  ).current;
};

const useModalAnimation = (isVisible: boolean, onClose: () => void) => {
  const pan = useRef(
    new Animated.Value(ANIMATION_CONFIG.INITIAL_POSITION),
  ).current;

  const panResponder = useModalPanResponder(pan, onClose);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(pan, {
        toValue: 0,
        useNativeDriver: true,
        ...ANIMATION_CONFIG.SPRING,
      }).start();
    }
  }, [isVisible, pan]);

  return { pan, panResponder };
};

type FullScreenModalProps<T> = PropsWithChildren<{
  isVisible: boolean;
  title?: string;
  moreOptions?: DropdownOption<T>[];
  onBackdropPress?: () => void;
}>;

export default function FullScreenModal<T>({
  children,
  isVisible,
  title,
  moreOptions,
  onBackdropPress,
}: FullScreenModalProps<T>) {
  const moreOptionsButtonRef = useRef<TouchableOpacity>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    setShowMoreOptions(false);
    setTimeout(() => {
      onBackdropPress?.();
    }, 50);
  }, [onBackdropPress]);

  const { pan, panResponder } = useModalAnimation(isVisible, handleClose);

  const handleMorePress = (e: GestureResponderEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreOptions((prev) => !prev);
  };

  const handleBackdropPress = () => {
    setShowMoreOptions(false);
    onBackdropPress?.();
  };

  const handleMoreOptionsSelect = (value: T) => {
    const selectedOption = moreOptions?.find(
      (option) => option.value === value,
    );
    selectedOption?.onPress?.();
    setShowMoreOptions(false);
  };

  return (
    <ReactModal
      visible={isVisible}
      supportedOrientations={["landscape", "portrait"]}
      animationType="none"
      transparent={true}
      onRequestClose={handleBackdropPress}
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
          <ModalHeader
            title={title}
            hasMoreOptions={!!moreOptions?.length}
            moreOptionsButtonRef={moreOptionsButtonRef}
            containerProps={panResponder.panHandlers}
            onClose={handleClose}
            onMorePress={handleMorePress}
          />
          <View style={styles.childrenContainer}>{children}</View>
        </Animated.View>
        {!!moreOptions?.length && (
          <Dropdown
            visible={showMoreOptions}
            isPortal={false}
            options={moreOptions}
            buttonRef={moreOptionsButtonRef}
            onClose={() => setShowMoreOptions(false)}
            onSelect={handleMoreOptionsSelect}
          />
        )}
      </View>
    </ReactModal>
  );
}

type ModalHeaderProps = {
  title?: string;
  hasMoreOptions?: boolean;
  moreOptionsButtonRef: RefObject<TouchableOpacity>;
  containerProps?: ViewProps;
  onClose: () => void;
  onMorePress: (e: GestureResponderEvent) => void;
};

function ModalHeader({
  title,
  hasMoreOptions,
  moreOptionsButtonRef,
  containerProps,
  onClose,
  onMorePress,
}: ModalHeaderProps) {
  return (
    <View {...containerProps} style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <CloseIcon color={Colors.text} size={FontSizes.base} />
      </TouchableOpacity>
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {hasMoreOptions && (
        <View style={styles.moreOptionsContainer}>
          <TouchableOpacity
            onPress={onMorePress}
            style={styles.moreOptionsButton}
            ref={moreOptionsButtonRef}
            activeOpacity={0.7}
          >
            <More color={Colors.text} size={28} />
          </TouchableOpacity>
        </View>
      )}
    </View>
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
