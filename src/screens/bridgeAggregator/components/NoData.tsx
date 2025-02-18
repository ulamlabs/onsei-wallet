import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  label: string;
  secondaryLabel: string;
};

export function NoData({ label, secondaryLabel }: Props) {
  return (
    <View style={styles.container}>
      <Svg width="80" height="81" viewBox="0 0 80 81" fill="none">
        <Path
          d="M39.9588 10.9005C52.4642 13.2872 68.0746 7.32746 75.644 17.5638C83.6334 28.3681 79.3267 43.8605 73.1601 55.7993C67.6426 66.4814 56.9354 72.4104 45.4607 75.9996C33.5793 79.7161 18.2339 84.873 9.96545 75.5664C1.9042 66.493 15.8902 53.3393 14.6056 41.2703C13.1335 27.4394 -6.61173 14.2435 2.30196 3.56601C10.9243 -6.76239 26.743 8.37818 39.9588 10.9005Z"
          fill="#1D1D1D"
        />
        <Path
          d="M37.037 64.108C51.7646 64.108 63.7037 52.1689 63.7037 37.4413C63.7037 22.7137 51.7646 10.7747 37.037 10.7747C22.3094 10.7747 10.3704 22.7137 10.3704 37.4413C10.3704 52.1689 22.3094 64.108 37.037 64.108Z"
          stroke="#4E4E4E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M60.5329 66.1517C62.1032 70.8925 65.6884 71.3666 68.444 67.2184C70.9625 63.4258 69.3032 60.3147 64.7403 60.3147C61.3625 60.2851 59.4662 62.9221 60.5329 66.1517Z"
          stroke="#4E4E4E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: "auto",
    paddingTop: 8,
    width: 240,
  },
  label: {
    textAlign: "center",
    marginBottom: 12,
    marginTop: 24,
    color: Colors.text,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * 1.2,
    fontFamily: FontWeights.bold,
  },
  secondaryLabel: {
    textAlign: "center",
    color: Colors.text100,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
});
