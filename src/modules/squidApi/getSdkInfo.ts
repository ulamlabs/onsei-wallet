import { get } from "./baseApi";
import { SquidSdkChain, SquidToken } from "./types";

type GetSdkInfoResponse = {
  chains: SquidSdkChain[];
  tokens: SquidToken[];
  axelarscanURL: string;
  isInMaintenanceMode: boolean; // TODO: boolean or string?
  expressDefaultDisabled: string[];
};

const url = "/sdk-info";

export const getSdkInfo = () => get<GetSdkInfoResponse>(url);
