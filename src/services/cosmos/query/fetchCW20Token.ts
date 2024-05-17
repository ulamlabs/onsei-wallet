import { CW20MarketingInfo, CW20TokenInfo } from "./types";
import { Node } from "@/types";
import { queryCW20 } from "./queryCW20";
import { CosmTokenWithBalance } from "../types";

export async function fetchCW20Token(
  contractAddress: string,
  node: Node,
): Promise<CosmTokenWithBalance> {
  const [tokenInfo, marketingInfo] = await Promise.all([
    queryCW20<CW20TokenInfo>(contractAddress, { token_info: {} }, node),
    queryCW20<CW20MarketingInfo>(contractAddress, { marketing_info: {} }, node),
  ]);

  return {
    type: "cw20",
    id: contractAddress,
    decimals: tokenInfo.decimals,
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    logo: marketingInfo.logo?.url ?? "",
    balance: 0n,
    coingeckoId: "",
  };
}
