import { CosmToken } from "@/services/cosmos";
import { Node } from "@/types";
import { ethers } from "ethers";
import { EVM_RPC_MAIN, EVM_RPC_TEST, erc20Abi } from "../consts";
import { resolvePointerContract } from "../utils";

export function prepareRawContract(pointerContract: `0x${string}`, node: Node) {
  const isMainnet = node === "MainNet";
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const contract = new ethers.Contract(pointerContract, erc20Abi, provider);
  return contract;
}

export async function fetchERC20TokenBalance(
  node: Node,
  token: CosmToken,
  accountAddressEvm: `0x${string}`,
) {
  try {
    const pointerContract = await resolvePointerContract(token);

    if (!pointerContract) {
      throw new Error("Failed updating ERC20 balances.");
    }

    const contract = prepareRawContract(pointerContract, node);
    const balance = await contract.balanceOf(accountAddressEvm);
    return balance;
  } catch (error: any) {
    throw error.message;
  }
}
