import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSettingsStore, useToastStore } from "@/store";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import {
  formatIpfsToHttpUrl,
  useInvalidateNFTs,
  useCollectionMinter,
  useCollectionInfo,
} from "@/modules/nfts/api";
import {
  formatNFTName,
  getAccountExplorerURL,
  getTokenExplorerURL,
  mapAttributesFromObject,
} from "./utils";
import { useState } from "react";
import Image from "../../components/Image";
import { trimAddress } from "@/utils";
import { Skeleton } from "@/components/Skeleton";

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
  const { isNFTHidden, hideNFT, showNFT } = useNFTsGalleryStore();
  const isHidden = isNFTHidden(nft.tokenId);
  const { error } = useToastStore();
  const invalidateNFTs = useInvalidateNFTs();
  const [isImageValid, setIsImageValid] = useState<boolean | null>(null);
  const collectionMinter = useCollectionMinter(nft.collectionAddress);
  const minterAddress = collectionMinter.data?.minter;

  const collection = useCollectionInfo(nft.collectionAddress);
  const extensionInfo = nft.info.extension;
  const name = nft.tokenMetadata?.name || extensionInfo?.name;
  const description =
    nft.tokenMetadata?.description ||
    extensionInfo?.description ||
    "No description available";
  const imageSrc = nft.tokenMetadata?.image || extensionInfo?.image || null;

  const attributes = mapAttributesFromObject(
    nft.tokenMetadata?.attributes || extensionInfo?.attributes,
  );

  const handleSetAvatar = () => {
    if (imageSrc) {
      setSetting("avatar", formatIpfsToHttpUrl(imageSrc));
    } else {
      error({ description: "Image not available" });
    }
  };

  const handleToggleVisibility = () => {
    if (isHidden) {
      showNFT(nft.tokenId);
    } else {
      hideNFT(nft.tokenId);
    }
    invalidateNFTs();
  };

  const handleCreatorPress = () => {
    if (minterAddress) {
      Linking.openURL(getAccountExplorerURL(minterAddress));
    } else {
      error({ description: "Creator address not available" });
    }
  };

  const handleOpenOwnershipHistory = () => {
    if (nft.collectionAddress) {
      Linking.openURL(getTokenExplorerURL(nft.collectionAddress));
    } else {
      error({ description: "Collection address not available" });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        src={imageSrc}
        style={styles.image}
        isError={!isImageValid}
        onError={() => {
          setIsImageValid(false);
        }}
        onLoad={() => {
          setIsImageValid(true);
        }}
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{formatNFTName(name)}</Text>
          {imageSrc && isImageValid && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSetAvatar}
            >
              <Text style={styles.actionButtonText}>Set as Avatar</Text>
            </TouchableOpacity>
          )}
        </View>
        {collection.isLoading ? (
          <Skeleton width={150} height={20} style={styles.collection} />
        ) : (
          <Text style={styles.collection}>
            {collection.data?.name || "Collection name unavailable"}
          </Text>
        )}

        {collectionMinter.isLoading ? (
          <Skeleton width={250} height={20} style={styles.creator} />
        ) : (
          minterAddress && (
            <TouchableOpacity
              onPress={handleCreatorPress}
              disabled={!minterAddress}
            >
              <Text style={styles.creator}>
                Created by{" "}
                <Text style={styles.creatorLink}>
                  {trimAddress(minterAddress)}
                </Text>
              </Text>
            </TouchableOpacity>
          )
        )}

        <View style={styles.idRow}>
          <Text style={styles.idText}>ID: {nft.tokenId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {attributes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attributes</Text>
            <View style={styles.attributes}>
              {attributes.map((attribute) => (
                <View key={attribute.trait_type} style={styles.attribute}>
                  <Text style={styles.attributeKey}>
                    {attribute.trait_type}
                  </Text>
                  <Text style={styles.attributeValue}>{attribute.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {nft.collectionAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ownership History</Text>
            <TouchableOpacity
              style={styles.explorerButton}
              onPress={handleOpenOwnershipHistory}
            >
              <Text style={styles.actionButtonText}>View on Explorer</Text>
            </TouchableOpacity>
          </View>
        )}

        {extensionInfo?.royalty_percentage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Royalties</Text>
            <View style={styles.royaltyContainer}>
              <Text style={styles.description}>
                {extensionInfo?.royalty_percentage}% of secondary sales go to
                creator
              </Text>
              <Text style={styles.royaltyAddress}>
                Recipient: {trimAddress(extensionInfo?.royalty_payment_address)}
              </Text>
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
    padding: 8,
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
  creator: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  idText: {
    color: "#999",
    fontSize: 14,
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
  historyContainer: {
    gap: 8,
  },
  historyItem: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyAddress: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  historyDate: {
    color: "#999",
    fontSize: 12,
  },
  historyHash: {
    color: "#666",
    fontSize: 12,
  },
  creatorLink: {
    textDecorationLine: "underline",
    color: "#FFF",
  },
  royaltyContainer: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
  },
  royaltyAddress: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  explorerButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
