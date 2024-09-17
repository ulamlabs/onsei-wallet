import { api } from "@/modules/api";
import { hexToNumber, numberToHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { EVM_RPC_MAIN } from "../consts";
import { getPrivateKeyFromMnemonic } from "../utils";

export async function linkAddresses(mnemonic: string) {
  const privKey = await getPrivateKeyFromMnemonic(mnemonic);

  const account = privateKeyToAccount(privKey);
  const message = "Link your EVM and Sei addresses";
  const signature = await account.signMessage({ message });

  const sig = signature.slice(2); // remove "0x";
  const r = `0x${sig.slice(0, 64)}`;
  const s = `0x${sig.slice(64, 128)}`;
  const v = hexToNumber(`0x${sig.slice(128, 130)}`);

  const messageLength = Buffer.from(message, "utf8").length;
  const messageToSign = `\x19Ethereum Signed Message:\n${messageLength}${message}`;
  // https://www.docs.sei.io/dev-advanced-concepts/evm-rpc-endpoints#sei_associate
  const request = {
    r,
    s,
    v: numberToHex(v - 27),
    custom_message: messageToSign,
  };

  try {
    const resp = await api.post(EVM_RPC_MAIN, {
      id: 1,
      jsonrpc: "2.0",
      method: "sei_associate",
      params: [request],
    });

    if (resp.data.error) {
      return `Failed to link addresses${resp.data.error.message}`;
    }
    return;
  } catch (e: any) {
    console.error(e);
    return "Failed to link addresses. Try again later";
  }
}
