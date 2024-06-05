import { useGasPrice } from "@/hooks";
import { estimateTransferFeeWithGas } from "@/services/cosmos/tx";
import { useFeeStore, useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatAmount, formatFee } from "@/utils";
import { useMemo } from "react";
import { Pressable } from "react-native";
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
  const { setGasPrice, gasPrices, gas, setFee } = useFeeStore();
  const { minGasPrice } = useGasPrice();

  const token = useMemo(() => tokenMap.get(tokenId)!, [tokenId, tokenMap]);
  const speedMultiplier = gasPrices.find(
    (gp) => gp.speed === title,
  )!.multiplier;

  const gasPrice = minGasPrice
    ? `${minGasPrice * speedMultiplier}usei`
    : "0.1usei";

  const fee = estimateTransferFeeWithGas(gasPrice, gas);

  const feeInt = BigInt(fee.amount[0].amount);

  return (
    <Pressable
      onPress={() => {
        setGasPrice(title);
        setFee(fee);
      }}
    >
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
              {formatAmount(feeInt, token.decimals)} {token.symbol}
            </Text>
            <Text style={{ fontSize: FontSizes.xs, color: Colors.text100 }}>
              {formatFee(feeInt, token)}
            </Text>
          </Column>
        </Row>
      </Box>
    </Pressable>
  );
}
