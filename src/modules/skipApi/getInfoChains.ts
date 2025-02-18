import { get } from "./baseApi";
import { SkipChain } from "./types";

type GetInfoChainsResponse = {
  chains: SkipChain[];
};

const url = "/v1/info/chains";

const params = {
  include_evm: true,
  include_svm: true,
  include_testnets: false,
};

export const getInfoChains = () => get<GetInfoChainsResponse>(url, params);
