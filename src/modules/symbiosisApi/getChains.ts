import { get } from "./baseApi";
import { SymbiosisChain } from "./types";

const url = "/v1/chains";

export const getChains = () => get<SymbiosisChain[]>(url);
