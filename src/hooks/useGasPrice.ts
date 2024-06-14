import { NETWORK_NAMES } from "@/const";
import { useGas } from "@/modules/gas";
import { useSettingsStore } from "@/store";
import { getSpeedMultiplier } from "@/utils";

export function createGasPrice(
  minGasPrice: number | undefined,
  multiplier: number,
) {
  return minGasPrice ? `${minGasPrice * multiplier}usei` : "0.1usei";
}

export function useGasPrice() {
  const {
    settings: { node, localGasPrice },
  } = useSettingsStore();
  const { data: gasPrices } = useGas();
  const networkName = NETWORK_NAMES[node] as "pacific-1" | "atlantic-2";
  const minGasPrice = gasPrices?.[networkName].min_gas_price;
  const gasPrice = createGasPrice(
    minGasPrice,
    getSpeedMultiplier(localGasPrice),
  );

  return { gasPrice, minGasPrice };
}
