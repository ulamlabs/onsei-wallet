import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { isAddress } from "viem";

export default function getChain(address: string) {
  if (isAddress(address)) {
    return "EVM";
  }
  if (isValidSeiCosmosAddress(address)) {
    return "SEI";
  }
  return null;
}
