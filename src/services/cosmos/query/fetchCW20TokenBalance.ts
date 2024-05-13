import { CW20BalanceInfo } from "./types";
import { Node } from "@/types";
import { queryCW20 } from "./queryCW20";

export async function fetchCW20TokenBalance(
  accountAddress: string,
  contractAddress: string,
  node: Node,
): Promise<string> {
  const query = { balance: { address: accountAddress } };
  const balanceInfo = await queryCW20<CW20BalanceInfo>(
    contractAddress,
    query,
    node,
  );
  return balanceInfo.balance;
}
