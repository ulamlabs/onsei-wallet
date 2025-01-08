import { scale, verticalScale } from "@/utils";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafeLayoutPaddings = () => {
  const insets = useSafeAreaInsets();

  const layoutPaddings = {
    paddingTop: verticalScale(24), // No need for insets at the top, beacuse header handles it
    paddingBottom: Math.max(verticalScale(50), insets.bottom),
    paddingLeft: Math.max(scale(16), insets.left),
    paddingRight: Math.max(scale(16), insets.right),
  } as const;

  return layoutPaddings;
};
