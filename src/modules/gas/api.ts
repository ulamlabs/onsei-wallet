import { useQuery } from "@tanstack/react-query";
import { get } from "../api";

type NetworkNames = "pacific-1" | "atlantic-2";
type NetworkConfig = {
  denom: string;
  min_gas_price: number;
};

type GasResponse = {
  [network in NetworkNames]: NetworkConfig;
};
async function getGasPrices() {
  const { data } = await get<GasResponse>(
    "https://raw.githubusercontent.com/sei-protocol/chain-registry/main/gas.json",
  );
  return data;
}

export const useGas = () =>
  useQuery({
    queryKey: ["transactions"],
    queryFn: getGasPrices,
  });
