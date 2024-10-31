import { Loader, Row, SafeLayoutBottom } from "@/components";
import { OnboardingParamList } from "@/navigation/OnboardingNavigation";
import { useOnboardingStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

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
    const timeout = setTimeout(() => {
      onboardingStore.finishOnboarding();
    }, 100);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeLayoutBottom>
      <Row style={{ justifyContent: "center", flex: 1 }}>
        <Loader size="large" />
      </Row>
    </SafeLayoutBottom>
  );
}
