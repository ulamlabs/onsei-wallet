import { Row, Text, TokenIcon } from "@/components";
import { CosmToken } from "@/services/cosmos";
import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { View } from "react-native";

type TokenInfoProps = PropsWithChildren & {
  token: CosmToken;
};

export default function Token({ token, children }: TokenInfoProps) {
  return (
    <Row
      style={{
        backgroundColor: Colors.background300,
        padding: 5,
        borderRadius: 22,
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 16,
      }}
    >
      <Row style={{ alignItems: "center" }}>
        <TokenIcon token={token} />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{token.name}</Text>
          <Text style={{ color: Colors.text100 }}>{token.symbol}</Text>
        </View>
      </Row>
      {children}
    </Row>
  );
}
