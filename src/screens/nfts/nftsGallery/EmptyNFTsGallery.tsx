import { Paragraph, Text } from "@/components";
import { useModalStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { InfoCircle, SearchNormal } from "iconsax-react-native";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function EmptyNFTsGallery() {
  const { alert } = useModalStore();
  function handleAddNFTInfo() {
    alert({
      title: "",
      description: (
        <Paragraph size="base" style={styles.infoDescription}>
          To add an NFT to Onsei NFT Collections, enter your wallet's address
          when purchasing an NFT on marketplace or send an NFT to this address
          from another wallet.
        </Paragraph>
      ),
      icon: InfoCircle,
      ok: "Got it",
      iconStyle: { transform: [{ rotate: "180deg" }] },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.emptyStateContainer}>
        <View style={styles.iconContainer}>
          <SearchNormal size={64} color={Colors.text400} />
        </View>
        <Text style={styles.title}>No NFT collected</Text>
        <TouchableOpacity
          onPress={handleAddNFTInfo}
          style={styles.subtitleContainer}
        >
          <Text style={styles.subtitle}>How to add your NFT here?</Text>
          <InfoCircle
            size={18}
            color={Colors.text400}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
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
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text400,
    fontFamily: FontWeights.regular,
    lineHeight: 21,
    textAlign: "center",
    letterSpacing: 0,
  },
  infoDescription: {
    color: Colors.text,
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.lg,
    lineHeight: 27,
    letterSpacing: 0,
  },
});
