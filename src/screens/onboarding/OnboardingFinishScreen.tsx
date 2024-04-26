import { Button, SafeLayout } from "@/components";
import { OnboardingParamList } from "@/navigation/OnboardingNavigation";
import { useOnboardingStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Text, View } from "react-native";

type OnboardingFinishScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  "Finish Onboarding"
>;

export default ({ navigation }: OnboardingFinishScreenProps) => {
  const onboardingStore = useOnboardingStore();

  useEffect(() => {
    resetNavigationStack(navigation);
  }, []);

  return (
    <SafeLayout>
      <View style={{ gap: 25 }}>
        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
          You have successfully setup your wallet!
        </Text>

        <Button
          label="Start using the wallet"
          onPress={() => onboardingStore.finishOnboarding()}
          styles={{ justifyContent: "center" }}
        />
      </View>
    </SafeLayout>
  );
};
