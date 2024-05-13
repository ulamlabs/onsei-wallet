import { Row, TertiaryButton } from "@/components";
import { Colors } from "@/styles";
import { Dimensions } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { View } from "react-native";
import { NavigationProp } from "@/types";

type NavigatorOptionsProps = { step: 1 | 2 };

export const newWalletScreenOptions = ({ step }: NavigatorOptionsProps) => {
  const screenW = Dimensions.get("window").width;

  return {
    headerTitle: () => (
      <Row
        style={{
          position: "absolute",
          top: 0,
          width: 0.65 * screenW,
          gap: 5,
        }}
      >
        <View
          style={{
            height: 4,
            flex: 1,
            borderRadius: 40,
            backgroundColor: Colors.text,
          }}
        ></View>
        <View
          style={{
            height: 4,
            flex: 1,
            borderRadius: 40,
            backgroundColor: step === 2 ? Colors.text : Colors.background400,
          }}
        ></View>
      </Row>
    ),
  } as NativeStackNavigationOptions;
};

export const addSkipButton = (
  navigation: NavigationProp,
  onSkip: () => void,
) => {
  navigation.setOptions({
    headerRight: () => (
      <TertiaryButton
        style={{ paddingHorizontal: 0 }}
        textStyle={{ color: Colors.text100, textAlign: "right" }}
        onPress={onSkip}
        title="Skip"
      />
    ),
  });
};
