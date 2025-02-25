import { Loader } from "@/components";
import React, { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";

type LoaderSizes = Parameters<typeof Loader>[0]["size"];

type CenteredLoaderProps = PropsWithChildren<{
  size?: LoaderSizes;
}>;

export default function CenteredLoader({
  children,
  size = "base",
}: CenteredLoaderProps) {
  return (
    <View style={styles.container}>
      <Loader size={size} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
