import { createGasPrice, useGasPrice } from "@/hooks";
import { estimateTransferFeeWithGas } from "@/services/cosmos/tx";
import { useSettingsStore, useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatAmount, formatFee } from "@/utils";
import { Pressable } from "react-native";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";

type Props = {
  title: "Low" | "Medium" | "High";
  selected?: boolean;
  gas: number;
  gasPrices: { speed: "Low" | "Medium" | "High"; multiplier: number }[];
};

export default function FeeBox({
  title,
  selected = false,
  gas,
  gasPrices,
}: Props) {
  const { sei } = useTokensStore();
  const { setSetting } = useSettingsStore();
  const { minGasPrice } = useGasPrice();

  const speedMultiplier = gasPrices.find(
    (gp) => gp.speed === title,
  )!.multiplier;

  const gasPrice = createGasPrice(minGasPrice, speedMultiplier);

  const fee = estimateTransferFeeWithGas(gasPrice, gas);

  const feeInt = BigInt(fee.amount[0].amount);

  return (
    <Pressable
      onPress={() => {
        setSetting("selectedGasPrice", {
          speed: title,
          multiplier: speedMultiplier,
        });
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
              {formatAmount(feeInt, sei.decimals)} SEI
            </Text>
            <Text style={{ fontSize: FontSizes.xs, color: Colors.text100 }}>
              {formatFee(feeInt, sei)}
            </Text>
          </Column>
        </Row>
      </Box>
    </Pressable>
  );
}
