import { View, StyleSheet } from "react-native";
import { Box, OptionGroup, Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import SectionTitle from "./SectionTitle";
import { trimAddress } from "@/utils";
import { NFTInfo, useCollectionMinter } from "@/modules/nfts/api";
import { ReactNode } from "react";
import Skeleton from "@/components/Skeleton";

type DetailItem = {
  title: string;
  value: ReactNode;
};

type DetailsSectionProps = {
  nft: NFTInfo;
};

export const DetailsSection = ({ nft }: DetailsSectionProps) => {
  const collectionMinter = useCollectionMinter(nft.collection.contractAddress);

  const data = [
    {
      title: "Contract Address",
      value: trimAddress(nft.collection.contractAddress),
    },
    {
      title: "Minter",
      value: collectionMinter.isLoading ? (
        <Skeleton width={120} height={24} />
      ) : (
        trimAddress(collectionMinter.data?.minter ?? "")
      ),
    },
    {
      title: "Royalty",
      value: `${nft.info.extension?.royalty_percentage}%`,
    },
    {
      title: "Royalty recipient",
      value: trimAddress(nft.info.extension?.royalty_payment_address),
    },
  ] satisfies DetailItem[];

  return (
    <View style={styles.container}>
      <SectionTitle>Details</SectionTitle>
      <OptionGroup>
        {data.map((item) => (
          <Box key={item.title} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </Box>
        ))}
      </OptionGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text100,
  },
  value: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text,
  },
  item: {
    borderRadius: 0,
  },
});
