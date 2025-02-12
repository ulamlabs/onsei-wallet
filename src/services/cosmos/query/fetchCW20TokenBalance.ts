import { Node } from "@/types";
import { queryCW } from "./queryCW";
import { CW20BalanceInfo } from "./types";

export async function fetchCW20TokenBalance(
  accountAddress: string,
  contractAddress: string,
  node: Node,
): Promise<bigint> {
  try {
    const query = { balance: { address: accountAddress } };
    const balanceInfo = await queryCW<CW20BalanceInfo>(
      contractAddress,
      query,
      node,
    );
    return BigInt(balanceInfo.balance);
  } catch (error: any) {
    throw error.message;
  }
}
