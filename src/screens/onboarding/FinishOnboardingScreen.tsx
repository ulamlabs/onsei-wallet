import { PrimaryButton } from "@/components";
import { useOnboardingStore } from "@/store";

export default () => {
  const onboardingStore = useOnboardingStore();
  return (
    <>
      <PrimaryButton
        label="Finish setup"
        onPress={() => onboardingStore.finishOnboarding()}
      />
    </>
  );
};
