import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { isAddress } from "viem";

export default function getNFTStandard(address: string) {
  if (isAddress(address)) {
    return "ERC721";
  }
  if (isValidSeiCosmosAddress(address)) {
    return "CW721";
  }
  return null;
}
