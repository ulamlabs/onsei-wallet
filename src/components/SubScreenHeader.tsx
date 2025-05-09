import { CloseIcon, Text } from "@/components";
import { APP_HORIZONTAL_PADDING } from "@/const";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { ArrowLeft } from "iconsax-react-native";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SubScreenHeaderProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  icon?: "back" | "close";
  onIconPress: () => void;
}>;

export function SubScreenHeader({
  title,
  subtitle,
  icon = "close",
  children,
  onIconPress,
}: SubScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top, backgroundColor: Colors.background }}
    >
      <View style={styles.header}>
        <Pressable onPress={onIconPress}>
          {icon === "back" && (
            <ArrowLeft color={Colors.text} size={FontSizes["2xl"]} />
          )}
          {icon === "close" && <CloseIcon size={FontSizes.base} />}
        </Pressable>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    paddingVertical: 16,
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    gap: 24,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderStyle: "solid",
    borderColor: Colors.inputBorderColor,
    backgroundColor: Colors.background100,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    textAlign: "left",
  },
  titleText: {
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.lg,
    lineHeight: 21.6,
    letterSpacing: 0,
  },
  subtitleText: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.sm,
    lineHeight: 21,
    letterSpacing: 0,
    color: Colors.text100,
  },
});
