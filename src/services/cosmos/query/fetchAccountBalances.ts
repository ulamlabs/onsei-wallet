import { NODE_URL } from "@/const";
import { Node } from "@/types";
import { getQueryClient } from "@sei-js/cosmjs";

export async function fetchAccountBalances(address: string, node: Node) {
  const queryClient = await getQueryClient("https://rest." + NODE_URL[node]);
  return await queryClient.cosmos.bank.v1beta1.allBalances({ address });
}
