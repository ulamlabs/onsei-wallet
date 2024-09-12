import {
  Bip39,
  EnglishMnemonic,
  Slip10,
  Slip10Curve,
  stringToPath,
} from "@cosmjs/crypto";
import { createWalletClient, http, publicActions } from "viem";
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
