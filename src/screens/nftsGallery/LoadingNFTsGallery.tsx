import { Loader } from "@/components";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function LoadingNFTsGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Loader size="big" />
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
