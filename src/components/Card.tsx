import { Text } from "@/components";
import Image from "@/components/Image";
import { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ImageStyle } from "react-native";

export const CARD_MARGIN = 8;

type CardProps = {
  imageSrc: string | null;
  title: ReactNode;
  subtitle?: ReactNode;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function Card({
  imageSrc,
  title,
  subtitle,
  imageStyle,
}: CardProps) {
  return (
    <View style={[styles.card]}>
      <Image src={imageSrc} style={[styles.cardImage, imageStyle]} />
      <View style={styles.cardInfo}>
        {typeof title === "string" ? <BasicCardTitle title={title} /> : title}
        {typeof subtitle === "string" ? (
          <BasicCardSubtitle subtitle={subtitle} />
        ) : (
          subtitle
        )}
      </View>
    </View>
  );
}

type BasicCardTitleProps = {
  title: string;
};

export function BasicCardTitle({ title }: BasicCardTitleProps) {
  return <Text style={styles.cardTitle}>{title}</Text>;
}

type BasicCardSubtitleProps = {
  subtitle: string;
};

export function BasicCardSubtitle({ subtitle }: BasicCardSubtitleProps) {
  return <Text style={styles.cardSubtitle}>{subtitle}</Text>;
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
