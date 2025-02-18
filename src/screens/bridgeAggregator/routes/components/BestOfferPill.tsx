import { Text } from "@/components";
import { Colors, FontSizes } from "@/styles";
import { StyleSheet, View } from "react-native";

type Props = { isBestOffer: boolean };

export const BestOfferPill: React.FC<Props> = ({ isBestOffer }) => {
  if (!isBestOffer) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{"Best offer"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.markerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  text: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * 1.2,
  },
});
