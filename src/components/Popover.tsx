import tw from "@/lib/tailwind";
import { getTooltipStyle } from "@/utils/getTooltipStyle";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
  height?: number;
  width?: number;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  onPress: () => void;
};

export default ({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
  height = 40,
  width = 150,
  containerStyle = {},
  backgroundColor = "#617080",
  onPress,
}: Props) => {
  const isIOS = Platform.OS === "ios";
  const renderedElement = useRef<View>(null);
  const isMounted = useRef(false);

  const [dimensions, setDimensions] = useState({
    yOffset: 0,
    xOffset: 0,
    elementWidth: 0,
    elementHeight: 0,
  });

  const getElementPosition = useCallback(() => {
    renderedElement.current?.measure(
      (
        _frameOffsetX,
        _frameOffsetY,
        _width = 0,
        _height = 0,
        pageOffsetX = 0,
        pageOffsetY = 0
      ) => {
        isMounted.current &&
          setDimensions({
            xOffset: pageOffsetX,
            yOffset: isIOS
              ? pageOffsetY
              : pageOffsetY -
                Platform.select({
                  android: StatusBar.currentHeight,
                  ios: 20,
                  default: 0,
                }),
            elementWidth: _width,
            elementHeight: _height,
          });
      }
    );
  }, []);

  const handleOnPress = useCallback(() => {
    getElementPosition();
  }, [getElementPosition, isVisible]);

  useEffect(() => {
    isMounted.current = true;
    // Wait till element's position is calculated
    requestAnimationFrame(getElementPosition);
    const dimensionsListener = Dimensions.addEventListener(
      "change",
      getElementPosition
    );

    return () => {
      isMounted.current = false;
      dimensionsListener.remove();
    };
  }, [getElementPosition]);

  const tooltipStyle = useMemo(
    () =>
      getTooltipStyle({
        ...dimensions,
        backgroundColor,
        containerStyle,
        height,
        width,
      }),
    [backgroundColor, containerStyle, dimensions, height, width]
  );

  console.log(tooltipStyle);
  return (
    <View ref={renderedElement}>
      <Pressable
        onPress={() => {
          onPress();
          handleOnPress();
        }}
      >
        {toggleElement}
      </Pressable>
      <Modal
        style={tw`bg-background`}
        animationType="fade"
        transparent={true}
        visible={isVisible}
        supportedOrientations={["landscape", "portrait"]}
      >
        <TouchableOpacity style={tw`w-full h-full`} onPress={onBackdropPress}>
          <View
            style={[tooltipStyle, tw`border-black border-opacity-40 border-2`]}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
