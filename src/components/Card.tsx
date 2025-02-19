import { Text } from "@/components";
import Image from "@/components/Image";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ImageStyle } from "react-native";

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
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.tokenBoxBackground,
  },
  cardInfo: {
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    color: Colors.text,
    marginBottom: 4,
    fontFamily: FontWeights.bold,
    lineHeight: 19.2,
    letterSpacing: 0,
  },
  cardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text100,
    fontFamily: FontWeights.regular,
    lineHeight: 21,
    letterSpacing: 0,
  },
});
