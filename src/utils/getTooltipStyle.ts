import { Dimensions, I18nManager, StyleSheet, ViewStyle } from "react-native";
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
};

export const getTooltipStyle = ({
  yOffset,
  xOffset,
  elementHeight,
  elementWidth,
  width,
  height,
}: Props): ViewStyle => {
  const { x, y } = getTooltipCoordinate(
    xOffset,
    yOffset,
    elementWidth,
    elementHeight,
    ScreenWidth,
    ScreenHeight,
    width,
    height,
  );
  return StyleSheet.flatten([
    {
      [I18nManager.isRTL ? "right" : "left"]: x,
      top: y,
      width,
      height,
    },
  ]);
};
