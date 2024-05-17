import { CosmToken } from "@/services/cosmos";
import { Colors, FontWeights } from "@/styles";
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
      <Row style={{ alignItems: "center" }}>
        <TokenIcon token={token} />
        <View>
          <Text style={{ fontFamily: FontWeights.bold, fontSize: 16 }}>
            {token.name}
          </Text>
          <Text style={{ color: Colors.text100 }}>{token.symbol}</Text>
        </View>
      </Row>
      {children}
    </Box>
  );
}
