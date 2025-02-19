import { Text } from "@/components";
import { FontWeights } from "@/styles";
import { FontSizes } from "@/styles";
import { Colors } from "@/styles";
import { StyleSheet } from "react-native";
import { PropsWithChildren } from "react";

type SectionTitleProps = PropsWithChildren;

export default function SectionTitle({ children }: SectionTitleProps) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 16.8,
    letterSpacing: 0,
  },
});
