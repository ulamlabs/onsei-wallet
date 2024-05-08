import { getCosmWasmClient } from "@sei-js/cosmjs";
import { CW20MarketingInfo, CW20TokenInfo, CosmToken } from "./types";
import { NODE_URL } from "@/const";
import { Node } from "@/types";

export async function fetchCW20Token(
  contractAddress: string,
  node: Node,
): Promise<CosmToken> {
  try {
    return await _fetchCW20Token(contractAddress, node);
  } catch (error: any) {
    const message = error.toString();
    if (message.includes("Query failed")) {
      throw Error("Not a valid CW20 token");
    }
    throw Error("Failed to query token data");
  }
}

async function _fetchCW20Token(
  contractAddress: string,
  node: Node,
): Promise<CosmToken> {
  const client = await getCosmWasmClient("https://rpc." + NODE_URL[node]);

  const [tokenInfo, marketingInfo]: [CW20TokenInfo, CW20MarketingInfo] =
    await Promise.all([
      client.queryContractSmart(contractAddress, { token_info: {} }),
      client.queryContractSmart(contractAddress, { marketing_info: {} }),
    ]);

  return {
    type: "cw20",
    address: contractAddress,
    decimals: tokenInfo.decimals,
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    logo: marketingInfo.logo.url,
  };
}
