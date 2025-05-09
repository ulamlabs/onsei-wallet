import { Text } from "@/components";
import { Colors, FontSizes } from "@/styles";
import { StyleSheet, View } from "react-native";

type Props = {
  time?: number;
};
export function ExpectedTime({ time }: Props) {
  if (!time) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>
        {time % 60 === 0
          ? `${time / 60} minute${time / 60 > 1 ? "s" : ""}`
          : `${Math.floor(time / 60)} min, ${time % 60} sec`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 999,
    backgroundColor: Colors.grey725,
  },
  text: {
    color: Colors.text100,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * 1.5,
  },
});
