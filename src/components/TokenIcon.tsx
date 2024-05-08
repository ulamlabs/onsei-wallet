import { CosmToken } from "@/services/cosmos";
import { Image, View } from "react-native";

type TokenIconProps = {
  token: CosmToken;
};

export default function TokenIcon({ token }: TokenIconProps) {
  const style = { width: 32, height: 32 };

  if (!token.logo) {
    return <View style={style} />;
  }

  function getSource() {
    if (typeof token.logo === "number") {
      return token.logo as any;
    }
    return { uri: token.logo };
  }

  return <Image source={getSource()} style={style} />;
}
