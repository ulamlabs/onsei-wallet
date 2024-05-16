import { MsgMultiSend, MsgSend } from "./types";

export const parseSend = (data: MsgSend, address: string) => {
  const amount = BigInt(data?.amount[0]?.amount);

  const from = data?.from_address;

  const to = data?.to_address;

  const type = data?.from_address === address ? "Send" : "Receive";

  return { amount, from, to, type };
};

export const parseMultiSend = (data: MsgMultiSend, address: string) => {
  const amount = BigInt(data?.inputs[0].coins[0].amount);

  const from = data.inputs[0].address;

  const to = data.outputs[0].address;

  const type = data.inputs[0].address === address ? "Send" : "Receive";

  return { amount, from, to, type };
};
