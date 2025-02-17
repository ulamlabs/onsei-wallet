import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Box, { BoxProps } from "./Box";
import { PropsWithChildren } from "react";
import { Colors } from "@/styles";

type Position = {
  index: number;
  isFirstItem: boolean;
  isLastItem: boolean;
  isMiddleItem: boolean;
};

type BoxItemProps = PropsWithChildren<
  {
    position: Position;
  } & BoxProps
>;

const BoxItem = ({ children, position, ...itemProps }: BoxItemProps) => (
  <Box
    {...itemProps}
    style={[
      {
        flex: 1,
        backgroundColor: Colors.tokenBoxBackground,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        ...(position.isFirstItem && {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }),
        ...(position.isLastItem && {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }),
        ...(position.isMiddleItem && {
          borderRadius: 0,
        }),
      },
      itemProps?.style,
    ]}
  >
    {children}
  </Box>
);

const getPosition = (index: number, totalItems: number) => {
  return {
    index,
    isFirstItem: index === 0,
    isLastItem: index === totalItems - 1,
    isMiddleItem: index > 0 && index < totalItems - 1,
  } satisfies Position;
};

type RoundedBoxListProps = {
  children: (props: {
    Box: typeof BoxItem;
    getPosition: (index: number, totalItems: number) => Position;
  }) => React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

export default function RoundedBoxList({
  children,
  gap = 1,
  style,
}: RoundedBoxListProps) {
  return (
    <View style={[styles.container, { gap }, style]}>
      {children({ Box: BoxItem, getPosition })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
});
