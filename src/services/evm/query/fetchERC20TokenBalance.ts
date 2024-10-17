import { Node } from "@/types";
import { ethers } from "ethers";
import { EVM_RPC_MAIN, EVM_RPC_TEST, erc20Abi } from "../consts";
import { getPointerContract } from "../utils";

export function prepareRawContract(pointerContract: `0x${string}`, node: Node) {
  const isMainnet = node === "MainNet";
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const contract = new ethers.Contract(pointerContract, erc20Abi, provider);
  return contract;
}

export async function fetchERC20TokenBalance(
  node: Node,
  tokenId: string,
  accountAddressEvm: `0x${string}`,
) {
  try {
    const resolvePointerContract = await getPointerContract(tokenId);

    if (!resolvePointerContract) {
      throw new Error("Failed updating ERC20 balances.");
    }

    const contract = prepareRawContract(resolvePointerContract, node);
    const balance = await contract.balanceOf(accountAddressEvm);
    return balance;
  } catch (error: any) {
    throw error.message;
  }
}
