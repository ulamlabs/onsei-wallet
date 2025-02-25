import { Box, Text } from "@/components";
import Image from "@/components/Image";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ImageStyle } from "react-native";

type CardHorizontalProps = {
  imageSrc: string | null;
  title: ReactNode;
  subtitle?: ReactNode;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function CardHorizontal({
  imageSrc,
  title,
  subtitle,
  imageStyle,
}: CardHorizontalProps) {
  return (
    <Box style={[styles.card]}>
      <Image
        src={imageSrc}
        style={[styles.cardImage, imageStyle]}
        placeholder={{
          text: "No image",
          textStyle: styles.cardImagePlaceholderText,
        }}
      />
      <View style={styles.cardInfo}>
        {typeof title === "string" ? (
          <BasicCardHorizontalTitle title={title} />
        ) : (
          title
        )}
        {typeof subtitle === "string" ? (
          <BasicCardHorizontalSubtitle subtitle={subtitle} />
        ) : (
          subtitle
        )}
      </View>
    </Box>
  );
}

type BasicCardHorizontalTitleProps = {
  title: string;
};

export function BasicCardHorizontalTitle({
  title,
}: BasicCardHorizontalTitleProps) {
  return <Text style={styles.cardTitle}>{title}</Text>;
}

type BasicCardHorizontalSubtitleProps = {
  subtitle: string;
};

export function BasicCardHorizontalSubtitle({
  subtitle,
}: BasicCardHorizontalSubtitleProps) {
  return <Text style={styles.cardSubtitle}>{subtitle}</Text>;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
  },
  cardImage: {
    width: 42,
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
  },
  cardImagePlaceholderText: {
    fontSize: FontSizes.xs,
    textAlign: "center",
  },
  cardInfo: {},
  cardTitle: {
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.base,
    lineHeight: 19.2,
    letterSpacing: 0,
    color: Colors.text,
  },
  cardSubtitle: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.sm,
    lineHeight: 21,
    letterSpacing: 0,
    color: Colors.text100,
  },
});
