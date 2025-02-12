import { Text } from "@/components";
import Image from "@/components/Image";
import { View, StyleSheet, StyleProp, ImageStyle } from "react-native";

export const CARD_MARGIN = 8;

type BaseCardProps = {
  image: string | null;
  title: string;
  subtitle?: string;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function Card({
  image,
  title,
  subtitle,
  imageStyle,
}: BaseCardProps) {
  return (
    <View style={[styles.card]}>
      <Image image={image} style={[styles.cardImage, imageStyle]} />
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
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
  },
  cardInfo: {
    paddingVertical: 12,
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
});
