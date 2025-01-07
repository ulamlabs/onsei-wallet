import { get } from "./baseApi";
import { SquidToken } from "./types";

type GetTokensResponse = {
  tokens: SquidToken[];
};

const url = "/tokens";

export const getTokens = (chainId?: string) =>
  get<GetTokensResponse>(url, chainId ? { chainId } : undefined);
