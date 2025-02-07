import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components";
import { CARD_MARGIN } from "@/components/Card";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore, useSettingsStore, useToastStore } from "@/store";
import { useNFTGalleryStore } from "@/store/nftGallery";
import { useQueryClient } from "@tanstack/react-query";

type NFTDetailsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "NFTDetails"
>;

export default function NFTDetailsScreen({
  route: {
    params: { nft },
  },
}: NFTDetailsScreenProps) {
  const { setSetting } = useSettingsStore();
  const { isNFTHidden, hideNFT, showNFT } = useNFTGalleryStore();
  const isHidden = isNFTHidden(nft.id);
  const queryClient = useQueryClient();
  const { activeAccount } = useAccountsStore();
  const { info } = useToastStore();

  const handleSetAvatar = () => {
    setSetting("avatar", nft.image);
  };

  const handleToggleVisibility = () => {
    if (isHidden) {
      showNFT(nft.id);
    } else {
      hideNFT(nft.id);
    }
    queryClient.invalidateQueries({
      queryKey: ["nfts", activeAccount?.address],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: nft.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{nft.name}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSetAvatar}
          >
            <Text style={styles.actionButtonText}>Set as Avatar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.collection}>
          {nft.collection || "Uncategorized"}
        </Text>

        <View style={styles.seiTag}>
          <Text style={styles.seiTagText}>Sei</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {nft.description || "No description available"}
          </Text>
        </View>

        {nft.attributes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attributes</Text>
            <View style={styles.attributes}>
              {Object.entries(nft.attributes).map(([key, value]) => (
                <View key={key} style={styles.attribute}>
                  <Text style={styles.attributeKey}>{key}</Text>
                  <Text style={styles.attributeValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.bottomButton, isHidden && styles.showButton]}
          onPress={handleToggleVisibility}
        >
          <Text style={styles.actionButtonText}>
            {isHidden ? "Show in gallery" : "Hide from gallery"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.marketplaceButton]}
          onPress={() => info({ description: "Coming soon" })}
        >
          <Text style={styles.actionButtonText}>View on Marketplace</Text>
        </TouchableOpacity>
      </View>
      <View style={{ margin: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
  },
  content: {
    padding: CARD_MARGIN,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
    marginRight: 12,
  },
  collection: {
    fontSize: 16,
    color: "#999",
    marginBottom: 16,
  },
  seiTag: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  seiTagText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  attributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attribute: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
    minWidth: "45%",
  },
  attributeKey: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    color: "#FFF",
  },
  avatarButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
  },
  avatarButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
  },
  bottomButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 24,
  },
  showButton: {
    backgroundColor: "#2A2A2A",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  marketplaceButton: {
    backgroundColor: "#2A2A2A",
    marginTop: 8,
  },
});
