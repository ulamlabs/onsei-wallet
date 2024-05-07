import { Button, SafeLayout } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Strongbox } from "iconsax-react-native";
import { Text, View } from "react-native";

type OnboardingProtectionScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Protect Your Wallet"
>;

export default function OnboardingProtectionScreen({
  navigation,
}: OnboardingProtectionScreenProps) {
  function enablePin() {
    navigation.navigate("Enable PIN", { nextRoute: "Enable Biometrics" });
  }

  return (
    <SafeLayout>
      <View style={{ gap: 20 }}>
        <Text style={{ color: "white" }}>
          Protecting your wallet with PIN is strongly recommended
        </Text>

        <Button
          label="Enable Pin protection"
          onPress={enablePin}
          icon={<Strongbox color="white" />}
          styles={{ justifyContent: "center" }}
        />

        <Button
          label="Add protection later"
          styles={{ justifyContent: "center", backgroundColor: "transparent" }}
          textStyles={`font-normal`}
          onPress={() => navigation.push("Finish Onboarding")}
        />
      </View>
    </SafeLayout>
  );
}
