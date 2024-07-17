import {
  GradientBlob,
  Headline,
  Paragraph,
  SafeLayoutBottom,
} from "@/components";
import { AddWallet } from "@/screens/newWallet";
import { Dimensions, Image, View } from "react-native";

const logo = require("../../../assets/logo.png");

export default function OnboardingWelcomeScreen() {
  const { width, height } = Dimensions.get("window");

  return (
    <SafeLayoutBottom>
      <View>
        <Image
          source={logo}
          resizeMode="contain"
          style={{
            width: 164,
            height: 66,
            marginBottom: height > 750 ? 124 : 62,
            marginHorizontal: "auto",
          }}
        />
        <Headline>Welcome to Onsei Wallet</Headline>

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
        <GradientBlob />
        <GradientBlob
          bottomAllign
          style={{
            transform: [
              { translateX: (width + 50) / 2 },
              { translateY: (width + 50) / 2 },
              { scale: 1.5 },
            ],
          }}
        />
      </View>
    </SafeLayoutBottom>
  );
}
