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
import { useSettingsStore } from "@/store";

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

  const handleSetAvatar = () => {
    setSetting("avatar", nft.image);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: nft.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{nft.name}</Text>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={handleSetAvatar}
          >
            <Text style={styles.avatarButtonText}>Set as Avatar</Text>
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
      </View>
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
});
