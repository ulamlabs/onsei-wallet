import {
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
} from "@/components";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TickCircle } from "iconsax-react-native";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Pin Change Success">;

export default function PinChangeSuccessScreen({ navigation }: Props) {
  return (
    <SafeLayoutBottom>
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            padding: 20,
            width: 128,
            height: 128,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 22,
            backgroundColor: Colors.success100,
          }}
        >
          <TickCircle variant="Bold" color={Colors.success} size={88} />
        </View>
        <Headline>Passcode changed successfully</Headline>
        <Paragraph size="base" style={{ textAlign: "center" }}>
          Keep your passcode safe and never share it.
        </Paragraph>
      </Column>
      <PrimaryButton
        title="Done"
        onPress={() => navigation.navigate("Security and privacy")}
      />
    </SafeLayoutBottom>
  );
}
