import { post } from "./baseApi";
import { SkipAsset } from "./types";

export type SkipRoutePayload = {
  allow_unsafe?: boolean;
  allow_multi_tx?: boolean;
  amount_in: string;
  amount_out?: string;
  bridges?: string[];
  cumulative_affiliate_fee_bps?: string;
  dest_asset_chain_id: string;
  dest_asset_denom: string;
  experimental_features?: string[];
  smart_relay?: boolean;
  source_asset_chain_id: string;
  source_asset_denom: string;
  swap_venues?: SwapVenue[];
};

export type SkipRoute = {
  amount_in: string;
  amount_out: string;
  chain_ids: string[];
  dest_asset_chain_id: string;
  does_swap: boolean;
  estimated_amount_out: string;
  estimaed_fees: {
    amount: string;
    bridge_id: "IBC" | "AXELAR" | "CCTP" | "HYPERLANE";
    chain_id: string;
    fee_type: "SMART_RELAY";
    operation_index: number;
    origin_asset: SkipAsset;
    tx_index: number;
    usd_amount: string;
  }[];
  operations: unknown[]; // TODO: type from Skip docs
  source_asset_chain_id: string;
  source_asset_denom: string;
  swap_price_impact_percent?: string;
  swap_venue: SwapVenue;
  txs_required: number;
  usd_amount_in: string;
  usd_amount_out: string;
  warning?: Warning;
};

type SwapVenue = { chain_id: string; name: string };

// TODO: better name
type Warning = {
  type: "LOW_INFO_WARNING" | "BAD_PRICE_WARNING";
  message: string;
};

export type SkipRouteError = {
  code: number;
  details: Warning[];
};

const url = "/v2/fungible/route";

export const postFungibleRoute = (payload: SkipRoutePayload) =>
  post<SkipRoute, SkipRoutePayload>(url, payload);
