import { CosmToken } from "@/services/cosmos";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { trimAddress } from "@/utils";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import Box from "./Box";
import { TokenIcon } from "./icons";
import { Row } from "./layout";
import { Text } from "./typography";

type TokenBoxProps = PropsWithChildren & {
  token: CosmToken;
  showId?: boolean;
};

export default function TokenBox({
  token,
  showId = false,
  children,
}: TokenBoxProps) {
  return (
    <Box
      style={{ backgroundColor: Colors.tokenBoxBackground }}
      testID={`${token.name}-box`}
    >
      <Row style={{ alignItems: "center", flexShrink: 1, paddingRight: 10 }}>
        <TokenIcon token={token} />
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              fontFamily: FontWeights.bold,
              fontSize: FontSizes.base,
              marginBottom: 2,
            }}
          >
            {token.symbol}
          </Text>
          <Row style={{ gap: 4 }}>
            <Text
              style={{
                color: Colors.text100,
                flexShrink: 1,
              }}
              numberOfLines={1}
            >
              {token.name}
            </Text>
            {showId && (
              <View
                style={{
                  backgroundColor: Colors.tokenIdBox,
                  paddingHorizontal: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
                  {trimAddress(token.id, { prefixCut: 3, suffixCut: 5 })}
                </Text>
              </View>
            )}
          </Row>
        </View>
      </Row>
      {children}
    </Box>
  );
}
