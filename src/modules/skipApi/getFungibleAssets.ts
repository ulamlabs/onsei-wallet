import { get } from "./baseApi";
import { SkipAsset } from "./types";

export type SkipAssetMap = {
  [chainId: string]: {
    assets: SkipAsset[];
  };
};

export type GetFungibleAssetsResponse = {
  chain_to_assets_map: SkipAssetMap;
};

const url = "/v2/fungible/assets";

const params = {
  include_cw20_assets: true,
  include_evm_assets: true,
  include_no_metadata_assets: false,
  include_svm_assets: true,
  include_testnets: false,
  native_only: false,
};

export const getFungibleAssets = (chain_id?: string) =>
  get<GetFungibleAssetsResponse>(
    url,
    chain_id ? { ...params, chain_id } : params,
  );
