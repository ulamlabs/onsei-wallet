import { useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { useMemo } from "react";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";

type Props = {
  title: "Low" | "Medium" | "High";
  tokenId: string;
  selected?: boolean;
};

export default function FeeBox({ title, tokenId, selected = false }: Props) {
  const { tokenMap } = useTokensStore();

  const token = useMemo(() => tokenMap.get(tokenId)!, [tokenId, tokenMap]);

  return (
    <Box
      style={{
        borderWidth: 1,
        borderColor: selected ? Colors.text : Colors.background200,
      }}
    >
      <Row style={{ justifyContent: "space-between", width: "100%" }}>
        <Text
          style={{ fontSize: FontSizes.base, fontFamily: FontWeights.bold }}
        >
          {title}
        </Text>
        <Column style={{ gap: 2, alignItems: "flex-end" }}>
          <Text
            style={{ fontSize: FontSizes.base, fontFamily: FontWeights.bold }}
          >
            {token.symbol}
          </Text>
          <Text style={{ fontSize: FontSizes.xs, color: Colors.text100 }}>
            {"<$0.01"}
          </Text>
        </Column>
      </Row>
    </Box>
  );
}
