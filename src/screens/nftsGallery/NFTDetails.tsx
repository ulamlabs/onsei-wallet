import { View, StyleSheet, ScrollView, Linking, FlatList } from "react-native";
import { Box, SafeLayout, SecondaryButton, Text } from "@/components";
import { useToastStore } from "@/store";
import {
  formatTokenId,
  getNFTAttributes,
  getNFTDescription,
  getNFTImage,
  getTokenExplorerURL,
} from "./utils";
import Image from "../../components/Image";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { ExportSquare, Send2 } from "iconsax-react-native";
import { DetailsSection } from "@/screens/nftsGallery/nftDetails/DetailsSection";
import SectionTitle from "./nftDetails/SectionTitle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";

type NFTDetailsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "NFT Details"
>;

export default function NFTDetailsScreen({
  route: {
    params: { nft },
  },
}: NFTDetailsScreenProps) {
  const { error, info } = useToastStore();

  const description = getNFTDescription(nft);
  const imageSrc = getNFTImage(nft);
  const attributes = getNFTAttributes(nft);

  const handleOpenTokenExplorer = () => {
    if (nft.collection.contractAddress) {
      Linking.openURL(getTokenExplorerURL(nft.collection.contractAddress));
    } else {
      error({ description: "Collection address not available" });
    }
  };

  const handleSend = () => {
    info({ description: "Coming soon" });
  };

  return (
    <SafeLayout subScreen>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Image src={imageSrc} style={styles.image} />

          <View style={styles.content}>
            <View>
              <Text style={styles.name}>{nft.collection.name}</Text>
              <Text style={styles.id}>{formatTokenId(nft.tokenId)}</Text>
            </View>

            <View style={styles.actionButtons}>
              <SecondaryButton
                style={{ flex: 1 }}
                icon={ExportSquare}
                onPress={handleOpenTokenExplorer}
                title="View on Explorer"
              />
              <SecondaryButton
                style={{ flex: 1, maxWidth: 64 }}
                icon={Send2}
                onPress={handleSend}
              />
            </View>

            <View style={styles.section}>
              <SectionTitle>About</SectionTitle>
              <Box style={{ backgroundColor: Colors.tokenBoxBackground }}>
                <Text style={styles.description}>
                  {description || "No description available"}
                </Text>
              </Box>
            </View>

            {attributes.length > 0 && (
              <View style={styles.section}>
                <SectionTitle>Attributes ({attributes.length})</SectionTitle>
                <View>
                  <FlatList
                    data={attributes}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ gap: 10 }}
                    contentContainerStyle={{ gap: 10 }}
                    renderItem={({ item }) => (
                      <Box key={item.trait_type} style={styles.attribute}>
                        <Text style={styles.attributeKey}>
                          {item.trait_type}
                        </Text>
                        <Text style={styles.attributeValue}>{item.value}</Text>
                      </Box>
                    )}
                  />
                </View>
              </View>
            )}

            <DetailsSection nft={nft} />
          </View>
        </ScrollView>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.tokenBoxBackground,
    borderRadius: 18,
  },
  content: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 27,
  },
  name: {
    color: Colors.text,
    flex: 1,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.xl,
    lineHeight: 24,
    letterSpacing: 0,
  },
  id: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.lg,
    color: Colors.text100,
    lineHeight: 27,
    letterSpacing: 0,
  },
  section: {
    gap: 10,
  },
  description: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text100,
  },
  attributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  attribute: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-start",
    backgroundColor: Colors.tokenBoxBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  attributeKey: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.xs,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.text100,
  },
  attributeValue: {
    marginTop: 2,
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
});
