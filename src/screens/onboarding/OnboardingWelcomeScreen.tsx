import { Headline, Paragraph, SafeLayoutBottom } from "@/components";
import { AddWallet } from "@/screens/newWallet";
import { APP_NAME } from "@/const";
import { View } from "react-native";

export default function OnboardingWelcomeScreen() {
  return (
    <SafeLayoutBottom>
      <View>
        <Headline>Welcome to {APP_NAME}</Headline>

        <Paragraph style={{ textAlign: "center" }}>
          To get started, create a new wallet or import one from a seed phrase.
        </Paragraph>
      </View>

      <AddWallet />
    </SafeLayoutBottom>
  );
}
