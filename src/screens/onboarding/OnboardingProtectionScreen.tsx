import {
  Column,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
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
          icon={Strongbox}
        />

        <TertiaryButton
          title="Add protection later"
          onPress={() => navigation.navigate("Finish Onboarding")}
        />
      </Column>
    </SafeLayoutBottom>
  );
}
