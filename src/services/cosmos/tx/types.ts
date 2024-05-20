import { StdFee } from "@cosmjs/stargate";
import { CosmToken } from "../types";

export type Transfer = {
  token: CosmToken;
  recipient: string;
  intAmount: bigint;
  fee: StdFee;
};
