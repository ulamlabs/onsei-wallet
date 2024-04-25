import {
  Dimensions,
  I18nManager,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import getTooltipCoordinate from "./getTooltipCoordinate";

const Screen = Dimensions.get("window");
const ScreenWidth = Screen.width;
const ScreenHeight = Screen.height;

type Props = {
  yOffset: number;
  xOffset: number;
  elementHeight: number;
  elementWidth: number;
  width: number;
  height: number;
  backgroundColor: string;
  containerStyle: StyleProp<ViewStyle>;
};

export const getTooltipStyle = ({
  yOffset,
  xOffset,
  elementHeight,
  elementWidth,
  width,
  height,
  backgroundColor,
  containerStyle,
}: Props): ViewStyle => {
  const { x, y } = getTooltipCoordinate(
    xOffset,
    yOffset,
    elementWidth,
    elementHeight,
    ScreenWidth,
    ScreenHeight,
    width,
    height
  );
  return StyleSheet.flatten([
    {
      position: "absolute",
      [I18nManager.isRTL ? "right" : "left"]: x,
      top: y,
      width,
      height,
      backgroundColor,
      // default styles
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      borderRadius: 10,
      padding: 10,
    },
    containerStyle,
  ]);
};
