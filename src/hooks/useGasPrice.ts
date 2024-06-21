import { NETWORK_NAMES } from "@/const";
import { useGas } from "@/modules/gas";
import { useSettingsStore, useToastStore } from "@/store";
import { NavigationProp } from "@/types";
import { getSpeedMultiplier } from "@/utils";
import { useNavigation } from "@react-navigation/native";

export function createGasPrice(
  minGasPrice: number | undefined,
  multiplier: number,
) {
  return minGasPrice ? `${minGasPrice * multiplier}usei` : "0.1usei";
}

export function useGasPrice(global?: boolean) {
  const {
    settings: { node, localGasPrice },
  } = useSettingsStore();
  const { data: gasPrices, error } = useGas();
  const navigation = useNavigation<NavigationProp>();
  const { error: errorToast } = useToastStore();
  if (global) {
    return { gasPrice: "0usei", minGasPrice: 0 };
  }

  if (error) {
    navigation.goBack();
    errorToast({
      description:
        "Failed to fetch gas prices. Please check internet connection",
    });
  }
  const networkName = NETWORK_NAMES[node] as "pacific-1" | "atlantic-2";
  const minGasPrice = gasPrices?.[networkName].min_gas_price;
  const gasPrice = createGasPrice(
    minGasPrice,
    getSpeedMultiplier(localGasPrice),
  );

  return { gasPrice, minGasPrice };
}
