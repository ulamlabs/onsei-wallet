import { Text } from "./typography";
import { View } from "react-native";
import { SearchNormal } from "iconsax-react-native";
import { Colors, FontSizes, FontWeights } from "@/styles";

type Props = {
  title: string;
  description?: string;
};

export default function EmptyList({ title, description }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SearchNormal
        size={73}
        color={Colors.text400}
        style={{ marginBottom: 20 }}
      />
      <Text
        style={{
          color: Colors.text400,
          fontSize: FontSizes.lg,
          fontFamily: FontWeights.bold,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      <Text style={{ color: Colors.text400, textAlign: "center" }}>
        {description}
      </Text>
    </View>
  );
}
