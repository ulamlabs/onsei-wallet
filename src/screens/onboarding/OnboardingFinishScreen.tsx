import {
  Checkbox,
  Paragraph,
  PrimaryButton,
  ResultHeader,
  SafeLayoutBottom,
  TextLink,
} from "@/components";
import { OnboardingParamList } from "@/navigation/OnboardingNavigation";
import { useOnboardingStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";

type OnboardingFinishScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  "Finish Onboarding"
>;

export default function OnboardingFinishScreen({
  navigation,
}: OnboardingFinishScreenProps) {
  const onboardingStore = useOnboardingStore();
  const [checked, setChecked] = useState(false);

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
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            justifyContent: "center",
            paddingRight: 42, // checkbox width + gap
            marginBottom: 32,
          }}
        >
          <Checkbox setChecked={setChecked} checked={checked} />
          <View style={{ alignItems: "center" }}>
            <Paragraph>I have read and agree to the</Paragraph>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TextLink
                url="https://www.onseiwallet.io/terms-and-conditions"
                text="Terms of Use"
              />
              <Paragraph>and</Paragraph>
              <TextLink
                url="https://www.onseiwallet.io/privacy-policy"
                text="Privacy Policy"
              />
            </View>
          </View>
        </View>
        <PrimaryButton
          title="Confirm"
          onPress={() => onboardingStore.finishOnboarding()}
          disabled={!checked}
        />
      </View>
    </SafeLayoutBottom>
  );
}
