import { Text } from "@/components";
import { Colors } from "@/styles";
import { CloseCircle } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function ErrorNFTsGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.errorStateContainer}>
        <CloseCircle size={64} color={Colors.text400} />
        <Text style={styles.title}>Unable to load NFTs</Text>
        <Text style={styles.subtitle}>Please try again later</Text>
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
  errorStateContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999999",
  },
});
