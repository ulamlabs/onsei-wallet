import { createGasPrice, useGasPrice } from "@/hooks";
import { estimateTransferFeeWithGas } from "@/services/cosmos/tx";
import { useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatAmount, formatFee } from "@/utils";
import { Pressable } from "react-native";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";

type Props = {
  title: "Low" | "Medium" | "High";
  selected?: boolean;
  gas?: number;
  gasPrices: { speed: "Low" | "Medium" | "High"; multiplier: number }[];
  onPress: () => void;
};

export default function FeeBox({
  title,
  selected = false,
  gas,
  gasPrices,
  onPress,
}: Props) {
  const { sei } = useTokensStore();
  const { minGasPrice } = useGasPrice();

  const speedMultiplier = gasPrices.find(
    (gp) => gp.speed === title,
  )!.multiplier;

  const getFeeInt = () => {
    if (!gas) {
      return;
    }
    const gasPrice = createGasPrice(minGasPrice, speedMultiplier);

    const fee = estimateTransferFeeWithGas(gasPrice, gas);

    const feeInt = BigInt(fee.amount[0].amount);
    return feeInt;
  };

  const feeInt = getFeeInt();

  const displayTitle = () => {
    switch (title) {
      case "Low":
        return "Lowest fee";
      case "Medium":
        return "Balanced";
      case "High":
        return "Fastest";
      default:
        return title;
    }
  };

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
            {displayTitle()}
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
                  {formatFee(feeInt, sei)}
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
