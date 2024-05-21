import { Colors, FontSizes, FontWeights } from "@/styles";
import { CosmToken } from "@/services/cosmos";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import Box from "./Box";
import TokenIcon from "./TokenIcon";
import { Row } from "./layout";
import { Text } from "./typography";

type TokenBoxProps = PropsWithChildren & {
  token: CosmToken;
};

export default function TokenBox({ token, children }: TokenBoxProps) {
  return (
    <Box>
      <Row style={{ alignItems: "center", flexShrink: 1 }}>
        <TokenIcon token={token} />
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{ fontFamily: FontWeights.bold, fontSize: FontSizes.base }}
          >
            {token.symbol}
          </Text>
          <Text
            style={{
              color: Colors.text100,
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {token.name}
          </Text>
        </View>
      </Row>
      {children}
    </Box>
  );
}
