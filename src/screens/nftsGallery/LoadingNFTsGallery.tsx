import { Loader } from "@/components";
import React, { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";

type LoadingNFTsGalleryProps = PropsWithChildren;

export default function LoadingNFTsGallery({
  children,
}: LoadingNFTsGalleryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Loader size="big" />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    alignItems: "center",
  },
});
