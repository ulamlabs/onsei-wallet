import { NETWORK_NAMES } from "@/const";
import { useGas } from "@/modules/gas";
import { useFeeStore, useSettingsStore } from "@/store";

export const useGasPrice = () => {
  const {
    settings: { node },
  } = useSettingsStore();
  const { selectedGasPrice } = useFeeStore();
  const { data: gasPrices } = useGas();
  const networkName = NETWORK_NAMES[node] as "pacific-1" | "atlantic-2";
  const minGasPrice = gasPrices?.[networkName].min_gas_price;
  const gasPrice = minGasPrice
    ? `${minGasPrice * selectedGasPrice.multiplier}usei`
    : "0.1usei";

  return { gasPrice, minGasPrice };
};
