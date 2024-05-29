import { NODE_URL } from "@/const";
import { Node } from "@/types";
import { getCosmWasmClient } from "@sei-js/cosmjs";

export async function queryCW20<T>(
  contractAddress: string,
  query: any,
  node: Node,
): Promise<T> {
  const client = await getCosmWasmClient("https://rpc." + NODE_URL[node]);
  try {
    return await client.queryContractSmart(contractAddress, query);
  } catch (error: any) {
    const message = error.toString();
    if (message.includes("Query failed")) {
      throw Error("Not a valid CW20 token");
    }
    throw Error("Failed to query token data");
  }
}
