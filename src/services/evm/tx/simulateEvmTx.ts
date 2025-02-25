import { CosmTokenWithBalance } from "@/services/cosmos";
import { Account, useAccountsStore, useSettingsStore } from "@/store";
import { StdFee } from "@cosmjs/stargate";
import { ethers } from "ethers";
import { EVM_RPC_MAIN, EVM_RPC_TEST, SZABO, erc20Abi } from "../consts";
import {
  getEvmClient,
  getPrivateKeyFromMnemonic,
  resolvePointerContract,
} from "../utils";
import { erc721Abi } from "viem";

export async function simulateEvmTx(
  mnemonic: string,
  receiver: `0x${string}`,
  amount: bigint,
  token: CosmTokenWithBalance,
  decimalAmount: string,
  memo: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmClient = await getEvmClient(mnemonic, !isMainnet);
  const { account, walletClient } = evmClient;
  if (token.symbol === "SEI") {
    const memoHex = ethers.hexlify(ethers.toUtf8Bytes(memo));
    const request = await walletClient.prepareTransactionRequest({
      account,
      to: receiver,
      value: amount * 10n ** BigInt(12),
      type: "legacy",
      data: memoHex as `0x${string}`,
    });
    const fee = (request.gas * request.gasPrice) / SZABO;
    const stdFee: StdFee = {
      amount: [{ amount: `${+fee.toString()}`, denom: "usei" }],
      gas: "",
    };
    const serializedTransaction = await walletClient.signTransaction(
      request as any,
    );
    return { stdFee, serializedTransaction };
  }
  const privateKey = await getPrivateKeyFromMnemonic(mnemonic);

  const pointerContract = await resolvePointerContract(token);

  if (!pointerContract) {
    throw new Error(
      "We couldn't find the contract information needed to process your transaction.",
    );
  }

  const { contract, signer, provider } = prepareContract(
    pointerContract,
    privateKey,
  );
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
  const fee = (gas * gasPrice) / SZABO; // in usei

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

export async function simulateEvmNftTx(
  mnemonic: string,
  receiver: `0x${string}`,
  contractAddress: `0x${string}`,
  tokenId: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmClient = await getEvmClient(mnemonic, !isMainnet);
  const { account, walletClient } = evmClient;
  const privateKey = await getPrivateKeyFromMnemonic(mnemonic);

  if (!contractAddress) {
    throw new Error(
      "We couldn't find the contract information needed to process your transaction.",
    );
  }

  const { contract, signer, provider } = prepareErc721Contract(
    contractAddress as `0x${string}`,
    privateKey,
  );

  console.log("contract", contract);
  const encodedData = contract.interface.encodeFunctionData("transferFrom", [
    signer.address,
    receiver,
    tokenId,
  ]);
  console.log("encodedData", encodedData);
  const gas = await provider.estimateGas({
    from: account.address,
    to: contractAddress,
    value: "0x0",
    data: encodedData,
  });
  console.log("gas", gas);

  const gasPrice = await walletClient.getGasPrice();
  const fee = (gas * gasPrice) / SZABO; // in usei
  console.log("fee", fee);
  const stdFee: StdFee = {
    amount: [{ amount: `${+fee.toString()}`, denom: "usei" }],
    gas: "",
  };
  const dataForTx = {
    tokenId,
    privateKey,
    contractAddress,
  };

  return { stdFee, dataForTx };
}

export function prepareContract(
  pointerContract: `0x${string}`,
  privateKey: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(pointerContract, erc20Abi, signer);
  return { contract, signer, provider };
}

export function prepareErc721Contract(
  pointerContract: `0x${string}`,
  privateKey: string,
) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(pointerContract, erc721Abi, signer);
  return { contract, signer, provider };
}

export async function sendEvmTx(
  pointerContract: `0x${string}`,
  privateKey: string,
  recipient: `0x${string}`,
  tokenAmount: bigint,
  memo?: string,
) {
  const { contract, signer } = prepareContract(pointerContract, privateKey);

  const encodedData = contract.interface.encodeFunctionData("transfer", [
    recipient,
    tokenAmount,
  ]);
  const transaction = {
    to: pointerContract,
    data: memo
      ? encodedData + ethers.hexlify(ethers.toUtf8Bytes(memo)).slice(2)
      : encodedData,
  };

  const tx = await signer.sendTransaction(transaction);
  return tx;
}

export async function sendEvmNftTx(
  contractAddress: `0x${string}`,
  privateKey: string,
  recipient: `0x${string}`,
  tokenId: string,
  memo?: string,
) {
  const { contract, signer } = prepareErc721Contract(
    contractAddress,
    privateKey,
  );

  const encodedData = contract.interface.encodeFunctionData("transferFrom", [
    signer.address,
    recipient,
    tokenId,
  ]);

  const transaction = {
    to: contractAddress,
    data: memo
      ? encodedData + ethers.hexlify(ethers.toUtf8Bytes(memo)).slice(2)
      : encodedData,
  };

  const tx = await signer.sendTransaction(transaction);
  return tx;
}

export async function sendDirectTx(data: any, requestAccount: Account) {
  const { getMnemonic } = useAccountsStore.getState();
  const privateKey = await getPrivateKeyFromMnemonic(
    getMnemonic(requestAccount.address),
  );
  const provider = new ethers.JsonRpcProvider(EVM_RPC_MAIN);
  const signer = new ethers.Wallet(privateKey, provider);
  const { hash } = await signer.sendTransaction(data);
  return hash;
}

export async function personalSign(data: any, requestAccount: Account) {
  const { account, walletClient } =
    await getCurrentClientAndAccount(requestAccount);
  const signature = await walletClient.signMessage({
    account: account,
    message: { raw: data },
  });
  return signature;
}

export async function signTransaction(data: any, requestAccount: Account) {
  const { account, walletClient } =
    await getCurrentClientAndAccount(requestAccount);
  const request = await walletClient.prepareTransactionRequest({
    account: account,
    ...data,
  });

  const signature = await walletClient.signTransaction(request);
  return signature;
}

export async function signTypedData(data: any, requestAccount: Account) {
  const { account, walletClient } =
    await getCurrentClientAndAccount(requestAccount);
  const signature = await walletClient.signTypedData({
    account: account,
    ...JSON.parse(data[1]),
  });
  return signature;
}

export async function sendRawTransaction(data: any, requestAccount: Account) {
  const { account, walletClient } =
    await getCurrentClientAndAccount(requestAccount);
  const request = await walletClient.prepareTransactionRequest({
    account,
    ...data,
  });

  const serializedTransaction = await walletClient.signTransaction(request);

  const hash = await walletClient.sendRawTransaction({ serializedTransaction });
  return hash;
}

export async function getCurrentClientAndAccount(requestAccount: Account) {
  const { getMnemonic } = useAccountsStore.getState();
  const evmClient = await getEvmClient(
    getMnemonic(requestAccount.address),
    false,
  );
  const { account, walletClient } = evmClient;
  return { account, walletClient };
}
