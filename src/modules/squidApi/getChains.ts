import { get } from "./baseApi";
import { SquidChain } from "./types";

type GetChainsResponse = {
  chains: SquidChain[];
};

const url = "/chains";

export const getChains = (chainId?: string) =>
  get<GetChainsResponse>(url, chainId ? { chainId } : undefined);
