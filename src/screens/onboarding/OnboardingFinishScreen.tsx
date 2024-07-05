import {
  GradientBlob,
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
import { Dimensions, View } from "react-native";

type OnboardingFinishScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  "Finish Onboarding"
>;

export default function OnboardingFinishScreen({
  navigation,
}: OnboardingFinishScreenProps) {
  const onboardingStore = useOnboardingStore();
  const { width, height } = Dimensions.get("window");
  console.log(width, height);

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
      <View // This view is here to make the blob image appear behind on android, elevation is not supported on Image
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          elevation: -1,
        }}
      >
        <GradientBlob
          style={{
            top: 0,
            right: 100,
            left: "auto",
            transform: [
              { translateX: (width + 50) / 2 },
              { translateY: -(width + 50) / (height > 900 ? 3 : 2) },
            ],
          }}
        />
      </View>
    </SafeLayoutBottom>
  );
}
