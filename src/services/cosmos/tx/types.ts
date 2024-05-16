import { StdFee } from "@cosmjs/stargate";
import { CosmToken } from "../types";

export type Transfer = {
  token: CosmToken;
  recipient: string;
  intAmount: string;
  fee: StdFee;
};
