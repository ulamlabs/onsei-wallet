import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { SearchNormal } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function EmptyNFTsGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyStateContainer}>
        <View style={styles.iconContainer}>
          <SearchNormal size={64} color={Colors.text400} />
        </View>
        <Text style={styles.title}>No NFT collected</Text>
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: FontWeights.bold,
    color: Colors.text400,
    marginBottom: 8,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text400,
    fontFamily: FontWeights.regular,
    lineHeight: 21,
    textAlign: "center",
    letterSpacing: 0,
  },
});
