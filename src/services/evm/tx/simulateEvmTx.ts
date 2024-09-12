import { CosmTokenWithBalance } from "@/services/cosmos";
import { useSettingsStore } from "@/store";
import { StdFee } from "@cosmjs/stargate";
import axios from "axios";
import { ethers } from "ethers";
import { isAddress } from "viem";
import { EVM_RPC_MAIN, EVM_RPC_TEST } from "../consts";
import { getEvmClient, getPrivateKeyFromMnemonic } from "../utils";

export async function simulateEvmTx(
  mnemonic: string,
  receiver: `0x${string}`,
  amount: bigint,
  token: CosmTokenWithBalance,
  decimalAmount: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmClient = await getEvmClient(mnemonic, !isMainnet);
  const { account, walletClient } = evmClient;
  if (token.symbol === "SEI") {
    const request = await walletClient.prepareTransactionRequest({
      account,
      to: receiver,
      value: amount * 10n ** BigInt(12),
      type: "legacy",
    });
    const fee = (request.gas * request.gasPrice) / 10n ** BigInt(12);
    const bal = await walletClient.getBalance({ address: account.address });
    console.log(bal);
    const stdFee: StdFee = {
      amount: [{ amount: `${+fee.toString()}`, denom: "usei" }],
      gas: "",
    };
    const serializedTransaction = await walletClient.signTransaction(request);
    return { stdFee, serializedTransaction };
  }
  const privateKey = await getPrivateKeyFromMnemonic(mnemonic);

  const pointerContract = await getPointerContract(token.id);

  if (!pointerContract) {
    throw new Error("Can't find pointer contract!");
  }

  const { contract, signer, provider } = prepareContract(
    pointerContract,
    privateKey,
  );
  const test = await contract.queryTransaction(
    "0xede1aedfb84cb6867f5cde8f78af0c89b01a974049cc732407214e8a62d796a2",
  );
  console.log(test, "test");
  const tokenAmount = ethers.parseUnits(decimalAmount, token.decimals);
  const balance = await contract.balanceOf(signer.address);

  if (balance < tokenAmount) {
    throw new Error("Not enough balance");
  }

  const encodedData = contract.interface.encodeFunctionData("transfer", [
    receiver,
    tokenAmount,
  ]);

  const gas = await provider.estimateGas({
    from: account.address,
    to: pointerContract,
    value: "0x0",
    data: encodedData,
  });

  const gasPrice = await walletClient.getGasPrice();
  const fee = (gas * gasPrice) / 10n ** BigInt(12); // in usei

  const stdFee: StdFee = {
    amount: [{ amount: `${+fee.toString()}`, denom: "usei" }],
    gas: "",
  };
  const dataForTx = {
    tokenAmount: tokenAmount.toString(),
    privateKey,
    pointerContract,
  };

  return { stdFee, dataForTx, pointerContract };
}

export async function getPointerContract(
  tokenAddress: string | `0x${string}`,
): Promise<`0x${string}` | undefined> {
  if (isAddress(tokenAddress)) return tokenAddress;
  const pointerContract = await axios.get(
    `https://v2.seipex.fi/pointer?address=${tokenAddress}`,
  );
  return pointerContract?.data?.nativePointer?.pointerAddress;
}

export function prepareContract(
  pointerContract: `0x${string}`,
  privateKey: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const erc20Abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
  ];
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(pointerContract, erc20Abi, signer);
  return { contract, signer, provider };
}

export async function sendEvmTx(
  pointerContract: `0x${string}`,
  privateKey: string,
  recipient: `0x${string}`,
  tokenAmount: bigint,
) {
  const { contract } = prepareContract(pointerContract, privateKey);

  const tx = await contract.transfer(recipient, tokenAmount);
  return tx;
}
