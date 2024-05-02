import {
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
} from "@/components";
import { OnboardingParamList } from "@/navigation/OnboardingNavigation";
import { useOnboardingStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { View } from "react-native";

type OnboardingFinishScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  "Finish Onboarding"
>;

export default function OnboardingFinishScreen({
  navigation,
}: OnboardingFinishScreenProps) {
  const onboardingStore = useOnboardingStore();

  useEffect(() => {
    resetNavigationStack(navigation);
  }, [navigation]);

  return (
    <SafeLayoutBottom>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Headline>You’re all done!</Headline>

        <Paragraph style={{ textAlign: "center" }}>
          You can now fully enjoy your wallet.
        </Paragraph>
      </View>

      <PrimaryButton
        title="Confirm"
        onPress={() => onboardingStore.finishOnboarding()}
      />
    </SafeLayoutBottom>
  );
}
