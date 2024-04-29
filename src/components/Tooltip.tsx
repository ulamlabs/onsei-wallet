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
  TouchableOpacity,
  View,
} from "react-native";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
  height?: number;
  width?: number;
  styles?: string;
  onPress: () => void;
};

export default function Tooltip({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
  height = 40,
  width = 150,
  styles,
  onPress,
}: Props) {
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
        pageOffsetY = 0,
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
      },
    );
  }, [isIOS]);

  const handleOnPress = useCallback(() => {
    getElementPosition();
  }, [getElementPosition]);

  useEffect(() => {
    isMounted.current = true;
    // Wait till element's position is calculated
    requestAnimationFrame(getElementPosition);
    const dimensionsListener = Dimensions.addEventListener(
      "change",
      getElementPosition,
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
        height,
        width,
      }),
    [dimensions, height, width],
  );

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
        animationType="fade"
        transparent={true}
        visible={isVisible}
        supportedOrientations={["landscape", "portrait"]}
      >
        <TouchableOpacity style={tw`w-full h-full`} onPress={onBackdropPress}>
          <View
            style={[
              tooltipStyle,
              tw.style(
                `border-black border-opacity-40 border-2 absolute items-center justify-center flex-1 p-2 rounded-lg bg-background`,
                styles,
              ),
            ]}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
