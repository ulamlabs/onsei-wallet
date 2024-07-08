import { PrimaryButton, ResultHeader, SafeLayoutBottom } from "@/components";
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ResultHeader
          type="Success"
          header="You're all done!"
          description="You can now fully enjoy your wallet."
        />
      </View>

      <PrimaryButton
        title="Confirm"
        onPress={() => onboardingStore.finishOnboarding()}
      />
    </SafeLayoutBottom>
  );
}
