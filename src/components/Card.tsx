import { Text } from "@/components";
import { View, Image, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CARD_MARGIN = 8;
const CARD_WIDTH = Math.floor((width - CARD_MARGIN * 3) / 2);

type BaseCardProps = {
  image: string;
  title: string;
  subtitle?: string;
  numColumns: number;
};

export default function Card({
  image,
  title,
  subtitle,
  numColumns,
}: BaseCardProps) {
  return (
    <View style={[styles.card, numColumns === 1 && styles.fullWidthCard]}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: CARD_MARGIN,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    // aspectRatio: 1,
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  fullWidthCard: {
    width: width - CARD_MARGIN * 6,
  },
});
