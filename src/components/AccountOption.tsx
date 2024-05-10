import { Colors } from "@/styles";
import { ArrowRight2 } from "iconsax-react-native";
import { StyleProp, Switch, TouchableOpacity, ViewStyle } from "react-native";
import { Paragraph } from "./typography";

type Props = {
  onPress: () => void;
  title: string;
  type?: "checkbox" | "default";
  value?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AccountOption({
  onPress,
  title,
  type = "default",
  value,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 22,
          paddingVertical: 16,
          backgroundColor: Colors.background100,
          height: 64,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Paragraph style={{ fontSize: 16, color: Colors.text }}>
        {title}
      </Paragraph>
      {type === "default" ? (
        <ArrowRight2 color={Colors.text} />
      ) : (
        <Switch
          onValueChange={onPress}
          style={{ height: 31 }}
          trackColor={{ true: Colors.switch }}
          value={value}
        />
      )}
    </TouchableOpacity>
  );
}
