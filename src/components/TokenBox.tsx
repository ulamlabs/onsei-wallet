import { CosmToken } from "@/services/cosmos";
import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import Box from "./Box";
import { Row } from "./layout";
import TokenIcon from "./TokenIcon";
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
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{token.name}</Text>
          <Text style={{ color: Colors.text100 }}>{token.symbol}</Text>
        </View>
      </Row>
      {children}
    </Box>
  );
}
