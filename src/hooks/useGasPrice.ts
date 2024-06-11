import { NETWORK_NAMES } from "@/const";
import { useGas } from "@/modules/gas";
import { useSettingsStore } from "@/store";

export const createGasPrice = (
  minGasPrice: number | undefined,
  multiplier: number,
) => (minGasPrice ? `${minGasPrice * multiplier}usei` : "0.1usei");

export const useGasPrice = () => {
  const {
    settings: { node, selectedGasPrice },
  } = useSettingsStore();
  const { data: gasPrices } = useGas();
  const networkName = NETWORK_NAMES[node] as "pacific-1" | "atlantic-2";
  const minGasPrice = gasPrices?.[networkName].min_gas_price;
  const gasPrice = createGasPrice(minGasPrice, selectedGasPrice.multiplier);

  return { gasPrice, minGasPrice };
};
