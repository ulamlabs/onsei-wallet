import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type CreatorProfileScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "CreatorProfile"
>;

export default function CreatorProfileScreen({
  route: {
    params: { profile },
  },
}: CreatorProfileScreenProps) {
  const handleOpenLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profile.avatar && (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{profile.name}</Text>
      </View>

      <View style={styles.content}>
        {profile.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{profile.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {profile.collections?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Collections</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.totalNFTs || 0}</Text>
              <Text style={styles.statLabel}>Total NFTs</Text>
            </View>
          </View>
        </View>

        {(profile.website || profile.twitter) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            {profile.website && (
              <TouchableOpacity
                style={styles.link}
                onPress={() => handleOpenLink(profile.website!)}
              >
                <Text style={styles.linkText}>🌐 Website</Text>
              </TouchableOpacity>
            )}
            {profile.twitter && (
              <TouchableOpacity
                style={styles.link}
                onPress={() =>
                  handleOpenLink(`https://twitter.com/${profile.twitter}`)
                }
              >
                <Text style={styles.linkText}>𝕏 Twitter</Text>
              </TouchableOpacity>
            )}
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
  header: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  content: {
    padding: 16,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  link: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    color: "#FFF",
    fontSize: 14,
  },
});
