import { Text } from "@/components";
import { CloseCircle } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function ErrorNFTsGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.errorStateContainer}>
        <View style={styles.iconContainer}>
          <CloseCircle size={32} color="#FFFFFF" />
        </View>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999999",
  },
});
