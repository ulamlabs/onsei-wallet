import { Text } from "@/components";
import { Tag } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function EmptyNFTsGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyStateContainer}>
        <View style={styles.iconContainer}>
          <Tag size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>No NFTs collected</Text>
        <Text style={styles.subtitle}>Your assets will appear here</Text>
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
  emptyStateContainer: {
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
