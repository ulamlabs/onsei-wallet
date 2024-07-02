import { api } from "@/modules/api";
import { EVM_RPC } from "../consts";

export async function isAddressLinked(address: string) {
  try {
    const response = await api.post(EVM_RPC, {
      jsonrpc: "2.0",
      method: "sei_getEVMAddress",
      params: [address],
      id: 1,
    });

    return !!response.data.result;
  } catch (e) {
    console.error(e);
    return false;
  }
}
