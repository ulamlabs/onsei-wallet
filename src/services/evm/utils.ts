import {
  Bip39,
  EnglishMnemonic,
  Slip10,
  Slip10Curve,
  stringToPath,
} from "@cosmjs/crypto";
import axios from "axios";
import { ethers } from "ethers";
import {
  PublicActions,
  createWalletClient,
  http,
  isAddress,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sei, seiTestnet } from "viem/chains";

export async function getPrivateKeyFromMnemonic(mnemonic: string) {
  // Ensure the mnemonic is a valid English Mnemonic
  const mnemonicChecked = new EnglishMnemonic(mnemonic);

  // Convert the mnemonic to a seed
  const seed = await Bip39.mnemonicToSeed(mnemonicChecked);

  // Specify the derivation path
  const derivationPath = "m/44'/118'/0'/0/0";

  // Use stringToPath to convert the string path to a format Slip10.derivePath expects
  const path = stringToPath(derivationPath);

  // Derive the private key using the specified curve and path
  const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, path);

  return ("0x" + Buffer.from(privkey).toString("hex")) as `0x${string}`;
}

export type WalletClientWithPublicActions = ReturnType<
  typeof createWalletClient
> &
  PublicActions;

export async function getEvmClient(mnemonic: string, testnet?: boolean) {
  const privateKey = await getPrivateKeyFromMnemonic(mnemonic);
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: testnet ? seiTestnet : sei,
    transport: http(),
  }).extend(publicActions);
  return { walletClient, account };
}

export function dataToMemo(data: string) {
  if (data.length < 138) {
    return ethers.toUtf8String(data);
  }

  const hexMemo = data.substring(138);
  if (hexMemo.length > 64) {
    return "";
  }
  return ethers.toUtf8String("0x" + hexMemo);
}

export async function getPointerContract(
  tokenAddress: string | `0x${string}`,
): Promise<`0x${string}` | undefined> {
  if (isAddress(tokenAddress)) {
    return tokenAddress;
  }
  const pointerContract = await axios.get(
    `https://v2.seipex.fi/pointer?address=${tokenAddress}`,
  );
  return pointerContract?.data?.nativePointer?.pointerAddress;
}

export const resolvePointerContract = async (token: {
  id: string;
  pointerContract?: `0x${string}`;
}): Promise<`0x${string}` | undefined> => {
  return (
    token.pointerContract ||
    (token.id.startsWith("0x")
      ? (token.id as `0x${string}`)
      : await getPointerContract(token.id))
  );
};
