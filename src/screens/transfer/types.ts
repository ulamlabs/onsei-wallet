import { CosmToken } from "@/services/cosmos";
import { StdFee } from "@cosmjs/stargate";

export type Transfer = {
  token: CosmToken;
  recipient: string;
  intAmount: string;
  fee: StdFee;
};
