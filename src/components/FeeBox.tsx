import { useTokensStore } from "@/store";
import { useMemo } from "react";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";

type Props = {
  title: string;
  tokenId: string;
};

export default function FeeBox({ title, tokenId }: Props) {
  const { tokenMap } = useTokensStore();

  const token = useMemo(() => tokenMap.get(tokenId)!, [tokenId, tokenMap]);

  return (
    <Box>
      <Row>
        <Text>{title}</Text>
        <Column>
          <Text>{token.symbol}</Text>
        </Column>
      </Row>
    </Box>
  );
}
