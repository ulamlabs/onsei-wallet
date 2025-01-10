import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

export function Header({ children }: PropsWithChildren) {
  return <Text style={styles.header}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    color: Colors.text,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.2,
    fontFamily: FontWeights.bold,
  },
});
