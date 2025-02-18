import { SkipAssetMap } from "@/modules/skipApi/getFungibleAssets";
import { SquidToken } from "@/modules/squidApi/types";
import { AssetId, ChainId, MergedAsset } from "./types";

const nativeAssetAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const mergedAssets = (
  skipAssetMap: SkipAssetMap,
  squidAssets: SquidToken[],
) => {
  const result = new Map<ChainId, Map<AssetId, MergedAsset>>();

  Object.entries(skipAssetMap).forEach(([chainId, { assets }]) => {
    const chainAssets = new Map<AssetId, MergedAsset>();

    assets.forEach((asset) => {
      if (!asset.name || !asset.symbol) {
        return;
      }
      const assetId = `${chainId}--${
        asset.denom.includes("-native") ? nativeAssetAddress : asset.denom
      }`;
      chainAssets.set(assetId, {
        assetIconUri: asset.logo_uri,
        assetId,
        bridges: ["Skip"],
        chainId: asset.chain_id,
        coingeckoId: asset.coingecko_id,
        decimals: asset.decimals,
        name: asset.name,
        skipDenom: asset.denom,
        symbol: asset.symbol,
      });
    });

    result.set(chainId, chainAssets);
  });

  squidAssets.forEach((asset) => {
    if (!asset.name || !asset.symbol) {
      return;
    }
    const chainId = asset.chainId.toString();
    const assetId = `${chainId}--${asset.address}`;

    let chainAssets = result.get(chainId);
    if (!chainAssets) {
      chainAssets = new Map<AssetId, MergedAsset>();
      result.set(chainId, chainAssets);
    }

    const foundAsset = chainAssets.get(assetId);
    if (foundAsset) {
      foundAsset.bridges.push("Squid");
      foundAsset.squidAddress = asset.address;
      return;
    }
    chainAssets.set(assetId, {
      assetIconUri: asset.logoURI,
      assetId,
      bridges: ["Squid"],
      chainId: chainId,
      name: asset.name,
      coingeckoId: asset.coingeckoId,
      decimals: asset.decimals,
      squidAddress: asset.address,
      symbol: asset.symbol,
    });
  });

  return result;
};
