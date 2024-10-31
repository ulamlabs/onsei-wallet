import {
  GradientBlob,
  Headline,
  Paragraph,
  SafeLayoutBottom,
  TextLink,
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Paragraph>By proceeding I agree to the</Paragraph>
          <TextLink
            url="https://www.onseiwallet.io/terms-and-conditions"
            text="Terms of Use"
          />
          <Paragraph>and</Paragraph>
          <TextLink
            url="https://www.onseiwallet.io/privacy-policy"
            text="Privacy Policy"
          />
          <Paragraph>and confirm that I have read them</Paragraph>
        </View>
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
