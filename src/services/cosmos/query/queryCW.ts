import { NODE_URL } from "@/const";
import { Node } from "@/types";
import { getCosmWasmClient } from "@sei-js/cosmjs";

export async function getCWClient(node: Node) {
  return await getCosmWasmClient("https://rpc." + NODE_URL[node]);
}

type QueryCWOptions = {
  node: Node;
  errorMessage?: string | ((error: any) => string);
};

export async function queryCW<T>(
  contractAddress: string,
  query: Record<string, any>,
  options: QueryCWOptions,
): Promise<T> {
  try {
    const client = await getCWClient(options.node);
    return await client.queryContractSmart(contractAddress, query);
  } catch (error: any) {
    const message = error.toString();
    if (message.includes("Query failed")) {
      throw Error("Not a valid CW token");
    }
    throw Error(
      typeof options.errorMessage === "function"
        ? options.errorMessage(error)
        : options.errorMessage ?? "Failed to query token data",
    );
  }
}
