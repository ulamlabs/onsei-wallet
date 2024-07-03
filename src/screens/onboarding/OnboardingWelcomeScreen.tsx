import { Headline, Paragraph, SafeLayoutBottom } from "@/components";
import { APP_NAME } from "@/const";
import { AddWallet } from "@/screens/newWallet";
import { Dimensions, Image, View } from "react-native";
const blob = require("../../../assets/blob.png");

export default function OnboardingWelcomeScreen() {
  const { width, height } = Dimensions.get("window");
  return (
    <SafeLayoutBottom>
      <View>
        <Headline>Welcome to {APP_NAME}</Headline>

        <Paragraph style={{ textAlign: "center" }}>
          To get started, create a new wallet or import one from a seed phrase.
        </Paragraph>
      </View>

      <AddWallet />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: [
            { rotate: "160deg" },
            { scale: 0.8 },
            { translateX: -width / 7 },
          ],
          zIndex: -1,
          elevation: -1,
        }}
      >
        <Image
          style={{
            position: "absolute",
            top: height / 12,
            left: width / 5,
            width: width,
            transform: [
              { translateX: -(width + 50) / 2 },
              { translateY: -(width + 50) / 2 },
              { scale: 1.5 },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
        <Image
          style={{
            position: "absolute",
            bottom: height / 12,
            right: width / 5,
            width: width,
            transform: [
              { translateX: (width + 50) / 2 },
              { translateY: (width + 50) / 2 },
              { scale: 1.5 },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
      </View>
    </SafeLayoutBottom>
  );
}
