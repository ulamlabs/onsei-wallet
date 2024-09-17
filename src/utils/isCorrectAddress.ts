import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { isAddress } from "viem";

export function isCorrectAddress(address: string) {
  return isValidSeiCosmosAddress(address) || isAddress(address);
}
