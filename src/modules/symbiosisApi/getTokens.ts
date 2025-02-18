import { get } from "./baseApi";
import { SymbiosisToken } from "./types";

const url = "/v1/tokens";

export const getTokens = () => get<SymbiosisToken[]>(url);
