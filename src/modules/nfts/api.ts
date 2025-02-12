import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Account, useAccountsStore, useSettingsStore } from "@/store";
import { Node } from "@/types";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { getCosmWasmClient } from "@sei-js/cosmjs";
import { getCWClient, queryCW } from "@/services/cosmos/query/queryCW";
import {
  CW721ContractInfo,
  CW721NumTokens,
  CW721Ownership,
  CW721AllTokenInfo,
  CW721Tokens,
} from "@/services/cosmos";
import { isValidUrl } from "@/utils/isValidUrl";

export type CreatorProfile = {
  name: string;
  description?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  collections?: string[];
  totalNFTs?: number;
};

export type TokenAttribute = {
  trait_type: string;
  value: string;
};

export type TokenMetadata = {
  name: string | null;
  image: string | null;
  description: string | null;
  attributes: TokenAttribute[];
};

const defaultMetadata = {
  name: null,
  image: null,
  description: null,
  attributes: [],
} satisfies TokenMetadata;

export type NFTInfo = {
  tokenId: string;
  ownership: CW721Ownership;
  //   TODO: how to get creator profile?
  creatorProfile?: CreatorProfile;
  collection_address?: string;
  collection?: {
    name: string;
    symbol: string;
  };
  tokenMetadata: TokenMetadata;
} & CW721AllTokenInfo;

function getCodeIdsByOwner(
  codes: Codes | undefined,
  ownerAddress: string | undefined,
) {
  if (!codes || !ownerAddress) {
    return [];
  }
  const codeIds = codes.filter(
    (code) => code.creator.toString() === ownerAddress,
  );
  return codeIds.map((code) => code.id);
}

async function getContractAddressesByCodeIds(codeIds: number[], node: Node) {
  const contractAddresses = [];
  for (const codeId of codeIds) {
    const contracts = await fetchCW721Contracts(codeId, node);
    contractAddresses.push(...contracts);
  }
  return contractAddresses;
}

export function getHttpUrl(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    const ipfsHash = uri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  return uri;
}

async function fetchTokenMetadata(
  uri: string,
  tokenId?: string,
): Promise<TokenMetadata> {
  if (!isValidUrl(uri)) {
    return defaultMetadata;
  }

  try {
    const httpUrl = getHttpUrl(uri);

    try {
      const metadataResponse = await fetch(httpUrl);
      if (metadataResponse.ok) {
        return await metadataResponse.json();
      }
    } catch (error) {
      console.debug(
        "Direct metadata fetch failed, trying with tokenId appended to url",
      );
    }

    if (tokenId) {
      const possiblePaths = [
        `${httpUrl}/${tokenId}`,
        `${httpUrl}/${tokenId}.json`,
        `${httpUrl}${tokenId}`,
        `${httpUrl}${tokenId}.json`,
      ];

      for (const path of possiblePaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          continue;
        }
      }
    }

    throw new Error("Failed to fetch metadata from all possible paths");
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return defaultMetadata;
  }
}

export async function queryNFTsByOwner(
  contractAddress: string,
  ownerAddress: string,
  node: Node,
) {
  try {
    // TODO: add pagination
    const tokensQuery = {
      tokens: {
        owner: ownerAddress,
        // start_after: "some_token_id", ?
        limit: 30,
      },
    };
    const contractInfoQuery = {
      contract_info: {},
    };
    const numTokensQuery = {
      num_tokens: {},
    };
    const ownershipQuery = {
      ownership: {},
    };

    const [tokensResult, contractInfo, numTokens, ownership] =
      await Promise.all([
        queryCW<CW721Tokens>(contractAddress, tokensQuery, node),
        queryCW<CW721ContractInfo>(contractAddress, contractInfoQuery, node),
        queryCW<CW721NumTokens>(contractAddress, numTokensQuery, node),
        queryCW<CW721Ownership>(contractAddress, ownershipQuery, node),
      ]);

    const nftInfoPromises = tokensResult.tokens.map<Promise<NFTInfo>>(
      async (tokenId: string) => {
        const allInfoQuery = {
          all_nft_info: {
            token_id: tokenId,
          },
        };

        const info = await queryCW<CW721AllTokenInfo>(
          contractAddress,
          allInfoQuery,
          node,
        );

        const tokenMetadata = await fetchTokenMetadata(
          info.info.token_uri,
          tokenId,
        );

        return {
          tokenId,
          collection: contractInfo,
          numTokens,
          ownership,
          tokenMetadata,
          access: info.access,
          info: info.info,
        };
      },
    );

    return (await Promise.all(nftInfoPromises)).flat();
  } catch (error) {
    console.error("Failed to query NFTs:", error);
    throw new Error("Failed to query NFTs");
  }
}

export async function queryAllNFTsByOwner(
  contractAddresses: Contracts | undefined,
  ownerAddress: string | undefined,
  node: Node,
): Promise<NFTInfo[]> {
  if (!contractAddresses || !ownerAddress) {
    return [];
  }

  try {
    const contractQueries = contractAddresses.map(async (contractAddress) => {
      try {
        const nfts = await queryNFTsByOwner(
          contractAddress,
          ownerAddress,
          node,
        );

        return nfts.map((nft) => ({
          ...nft,
          collection: nft.collection,
        }));
      } catch (error) {
        console.error(`Error querying contract ${contractAddress}:`, error);
        return [];
      }
    });

    const results = await Promise.all(contractQueries);
    return results.flat().filter(Boolean);
  } catch (error) {
    console.error("Failed to query NFTs across contracts:", error);
    throw new Error("Failed to query NFTs across contracts");
  }
}

export type Codes = Awaited<
  ReturnType<Awaited<ReturnType<typeof getCosmWasmClient>>["getCodes"]>
>;

export async function fetchAllCodes(node: Node): Promise<Codes> {
  try {
    const client = await getCWClient(node);
    return await client.getCodes();
  } catch (error) {
    console.error("Failed to fetch codes:", error);
    throw new Error("Failed to fetch codes");
  }
}

type Contracts = Awaited<
  ReturnType<Awaited<ReturnType<typeof getCosmWasmClient>>["getContracts"]>
>;

export async function fetchCW721Contracts(
  codeId: number,
  node: Node,
): Promise<Contracts> {
  try {
    const client = await getCWClient(node);

    return await client.getContracts(codeId);
  } catch (error) {
    console.error(`Failed to fetch contracts for code ${codeId}:`, error);
    throw new Error(`Failed to fetch contracts for code ${codeId}`);
  }
}

function getCodesQueryKey(node: Node) {
  return ["codes", node];
}

export function useCodes() {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getCodesQueryKey(node),
    queryFn: () => fetchAllCodes(node),
    staleTime: LONG_STALE_TIME,
  });
}

function getNFTsQueryKey(
  ownerAddress: string | undefined,
  contractAddresses: Contracts | undefined,
  node: Node,
) {
  return ["nfts", ownerAddress, contractAddresses, node];
}

export function useNFTs() {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const codesQuery = useCodes();
  const contractAddressesQuery = useContractAddresses();
  const nfts = useQuery({
    queryKey: getNFTsQueryKey(
      activeAccount?.address,
      contractAddressesQuery.data,
      node,
    ),
    queryFn: () =>
      queryAllNFTsByOwner(
        contractAddressesQuery.data,
        activeAccount?.address,
        node,
      ),
    enabled: !!activeAccount?.address && !!contractAddressesQuery.data,
  });
  return {
    codesQuery,
    contractAddressesQuery,
    nfts,
  };
}

export function useInvalidateNFTs() {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const contractAddressesQuery = useContractAddresses();
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: getNFTsQueryKey(
        activeAccount?.address,
        contractAddressesQuery.data,
        node,
      ),
    });
}

function getContractAddressesQueryKey(
  activeAccountAddress: Account["address"] | undefined,
  codeIds: number[],
  node: Node,
) {
  return ["contractAddresses", activeAccountAddress, codeIds, node];
}

function useContractAddresses() {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const codes = useCodes();
  const codeIds = getCodeIdsByOwner(codes.data, activeAccount?.address);
  const contractAddresses = useQuery({
    queryKey: getContractAddressesQueryKey(
      activeAccount?.address,
      codeIds,
      node,
    ),
    queryFn: () => getContractAddressesByCodeIds(codeIds, node),
    enabled: !!activeAccount?.address && !!codeIds,
    staleTime: LONG_STALE_TIME,
  });
  return contractAddresses;
}
