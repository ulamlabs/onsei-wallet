import {
  Column,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Strongbox } from "iconsax-react-native";

type OnboardingProtectionScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Protect Your Wallet"
>;

export default function OnboardingProtectionScreen({
  navigation,
}: OnboardingProtectionScreenProps) {
  function enablePin() {
    navigation.navigate("Enable Passcode", { nextRoute: "Enable Biometrics" });
  }

  return (
    <SafeLayoutBottom>
      <Paragraph style={{ textAlign: "center" }}>
        Protecting your wallet with passcode is strongly recommended
      </Paragraph>

      <Column>
        <PrimaryButton
          title="Enable Passcode protection"
          onPress={enablePin}
          icon={<Strongbox color={Colors.background} />}
        />

        <TertiaryButton
          title="Add protection later"
          onPress={() => navigation.push("Finish Onboarding")}
        />
      </Column>
    </SafeLayoutBottom>
  );
}
