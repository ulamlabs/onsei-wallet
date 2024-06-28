import { CosmToken } from "@/services/cosmos";
import { useState } from "react";
import { Image } from "react-native";

type TokenIconProps = {
  token: CosmToken;
};

const PLACEHOLDER_LOGO = require("../../../assets/token-placeholder.png");

export default function TokenIcon({ token }: TokenIconProps) {
  const [placeholder, setPlaceholder] = useState(false);
  const style = { width: 32, height: 32 };

  function getSource() {
    if (typeof token.logo === "number") {
      return token.logo as any;
    }
    if (token.logo) {
      return { uri: token.logo };
    }
    return PLACEHOLDER_LOGO;
  }

  if (placeholder) {
    return <Image source={PLACEHOLDER_LOGO} style={style} />;
  }

  return (
    <Image
      defaultSource={PLACEHOLDER_LOGO}
      onError={() => setPlaceholder(true)}
      source={getSource()}
      style={style}
    />
  );
}
