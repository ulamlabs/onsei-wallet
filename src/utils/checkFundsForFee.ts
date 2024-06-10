import { StdFee } from "@cosmjs/stargate";

export function checkFundsForFee(
  fee: StdFee | null,
  seiBalance: bigint,
  tokenId: string,
  seiId: string,
  intAmount: bigint,
) {
  if (!fee) {
    return false;
  }
  let seiLeft = seiBalance - BigInt(fee.amount[0].amount);
  if (tokenId === seiId) {
    seiLeft -= intAmount;
  }
  return seiLeft >= 0;
}
