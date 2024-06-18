import { createGasPrice, useGasPrice } from "@/hooks";
import { estimateTransferFeeWithGas } from "@/services/cosmos/tx";
import { useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatAmount, formatFee, getSpeedMultiplier } from "@/utils";
import { Pressable } from "react-native";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";

export type FeeTier = "Low" | "Medium" | "High";

type Props = {
  title: FeeTier;
  selected?: boolean;
  gas?: number;
  onPress: () => void;
};

export default function FeeBox({
  title,
  selected = false,
  gas,
  onPress,
}: Props) {
  const { sei } = useTokensStore();
  const { minGasPrice } = useGasPrice();

  const speedMultiplier = getSpeedMultiplier(title);

  function getFeeInt() {
    if (!gas) {
      return;
    }
    const gasPrice = createGasPrice(minGasPrice, speedMultiplier);

    const fee = estimateTransferFeeWithGas(gasPrice, gas);

    return BigInt(fee.amount[0].amount);
  }

  const feeInt = getFeeInt();

  return (
    <Pressable onPress={onPress}>
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
          <Column style={{ gap: 2, alignItems: "flex-end", minHeight: 39 }}>
            {feeInt ? (
              <>
                <Text
                  style={{
                    fontSize: FontSizes.base,
                    fontFamily: FontWeights.bold,
                  }}
                >
                  {formatAmount(feeInt, sei.decimals)} SEI
                </Text>
                <Text style={{ fontSize: FontSizes.xs, color: Colors.text100 }}>
                  {sei.price && formatFee(feeInt, sei)}
                </Text>
              </>
            ) : (
              <></>
            )}
          </Column>
        </Row>
      </Box>
    </Pressable>
  );
}
