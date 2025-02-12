import { NODE_URL } from "@/const";
import { Node } from "@/types";
import { getCosmWasmClient } from "@sei-js/cosmjs";

export async function getCWClient(node: Node) {
  return await getCosmWasmClient("https://rpc." + NODE_URL[node]);
}

export async function queryCW<T>(
  contractAddress: string,
  query: Record<string, any>,
  node: Node,
): Promise<T> {
  try {
    const client = await getCWClient(node);
    return await client.queryContractSmart(contractAddress, query);
  } catch (error: any) {
    const message = error.toString();
    if (message.includes("Query failed")) {
      throw Error("Not a valid CW token");
    }
    throw Error("Failed to query token data");
  }
}
