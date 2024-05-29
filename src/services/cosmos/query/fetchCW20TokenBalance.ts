import { Node } from "@/types";
import { queryCW20 } from "./queryCW20";
import { CW20BalanceInfo } from "./types";

export async function fetchCW20TokenBalance(
  accountAddress: string,
  contractAddress: string,
  node: Node,
): Promise<bigint> {
  const query = { balance: { address: accountAddress } };
  const balanceInfo = await queryCW20<CW20BalanceInfo>(
    contractAddress,
    query,
    node,
  );
  return BigInt(balanceInfo.balance);
}
