import { View, StyleSheet, Pressable } from "react-native";
import { Box, OptionGroup, Paragraph, Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import SectionTitle from "./SectionTitle";
import { trimAddress } from "@/utils";
import { NFTInfo } from "@/modules/nfts/api";
import { ReactNode } from "react";
import getChain from "@/utils/getChain";
import getNFTStandard from "@/utils/getNFTStandard";
import { InfoCircle } from "iconsax-react-native";
import { useModalStore } from "@/store";

type DetailItem = {
  title: string;
  value: ReactNode;
  info?: string;
};

type DetailsSectionProps = {
  nft: NFTInfo;
};

export const DetailsSection = ({ nft }: DetailsSectionProps) => {
  const { alert } = useModalStore();

  const data = [
    {
      title: "Contract Address",
      value: trimAddress(nft.collection.contractAddress),
    },
    {
      title: "Token Standard",
      value: getNFTStandard(nft.collection.contractAddress),
    },
    {
      title: "Chain",
      value: getChain(nft.collection.contractAddress),
    },
    {
      title: "Royalty",
      value: `${nft.info.extension?.royalty_percentage}%`,
      info: "The percentage of the sale price that the creator will receive as a royalty.",
    },
  ] satisfies DetailItem[];

  return (
    <View style={styles.container}>
      <SectionTitle>Details</SectionTitle>
      <OptionGroup>
        {data.map((item) => (
          <Box key={item.title} style={styles.item}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.info && (
                <Pressable
                  onPress={() =>
                    alert({
                      title: "",
                      description: (
                        <Paragraph size="base" style={styles.infoDescription}>
                          {item.info}
                        </Paragraph>
                      ),
                      icon: InfoCircle,
                      ok: "Got it",
                      iconStyle: { transform: [{ rotate: "180deg" }] },
                    })
                  }
                >
                  <InfoCircle
                    size={18}
                    color={Colors.text100}
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </Pressable>
              )}
            </View>
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
  infoDescription: {
    color: Colors.text,
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.lg,
    lineHeight: 27,
    letterSpacing: 0,
  },
});
