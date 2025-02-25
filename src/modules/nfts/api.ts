import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Account, useAccountsStore, useSettingsStore } from "@/store";
import { Node } from "@/types";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { getCosmWasmClient } from "@sei-js/cosmjs";
import { getCWClient, queryCW } from "@/services/cosmos/query/queryCW";
import {
  CW721CollectionInfo,
  CW721NumTokens,
  CW721AllTokenInfo,
  CW721Tokens,
  CW721Minter,
} from "@/services/cosmos";
import { isValidUrl } from "@/utils/isValidUrl";
import { loadFromStorage, saveToStorage } from "@/utils";
import {
  filterNFTs,
  groupNFTsByCollection,
  useFilterHiddenNFTs,
} from "@/screens/nfts/utils";
import formatIpfsToHttpUrl from "@/utils/formatIpfsToHttpUrl";

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

export type CollectionInfo = {
  contractAddress: string;
  name: string;
  symbol: string;
};

export type NFTInfo = {
  tokenId: string;
  collection: CollectionInfo;
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

async function getContractAddressesByCodeIds(
  codeIds: number[] | undefined,
  node: Node,
) {
  if (!codeIds) {
    return [];
  }

  const contracts = await Promise.all(
    codeIds.map((codeId) => fetchCW721Contracts(codeId, node)),
  );

  return contracts.flat();
}

async function fetchTokenMetadata(
  uri: string | undefined,
  tokenId?: string,
): Promise<TokenMetadata> {
  if (!uri || !isValidUrl(uri)) {
    return defaultMetadata;
  }

  try {
    const httpUrl = formatIpfsToHttpUrl(uri);

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

async function queryCollectionMinter(collectionAddress: string, node: Node) {
  const minterQuery = {
    minter: {},
  };
  return queryCW<CW721Minter>(collectionAddress, minterQuery, {
    node,
    errorMessage: "Error querying NFT minter",
  });
}

export function getCollectionMinterQueryKey(
  collectionAddress: string,
  node: Node,
) {
  return ["nftCollectionMinter", collectionAddress, node];
}

export function useCollectionMinter(collectionAddress: string) {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getCollectionMinterQueryKey(collectionAddress, node),
    queryFn: () => queryCollectionMinter(collectionAddress, node),
    enabled: !!collectionAddress && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

async function queryCollectionNumTokens(contractAddress: string, node: Node) {
  const numTokensQuery = {
    num_tokens: {},
  };
  return queryCW<CW721NumTokens>(contractAddress, numTokensQuery, {
    node,
    errorMessage: "Error querying NFT collection num tokens",
  });
}

export function getCollectionNumTokensQueryKey(
  collectionAddress: string,
  node: Node,
) {
  return ["collectionNumTokens", collectionAddress, node];
}

export function useCollectionNumTokens(collectionAddress: string) {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getCollectionNumTokensQueryKey(collectionAddress, node),
    queryFn: () => queryCollectionNumTokens(collectionAddress, node),
    enabled: !!collectionAddress && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

async function queryCollectionInfo(collectionAddress: string, node: Node) {
  const contractInfoQuery = {
    contract_info: {},
  };
  return queryCW<CW721CollectionInfo>(collectionAddress, contractInfoQuery, {
    node,
    errorMessage: "Error querying NFT collection info",
  });
}

export function getCollectionInfoQueryKey(
  collectionAddress: string,
  node: Node,
) {
  return ["collectionInfo", collectionAddress, node];
}

export function useCollectionInfo(collectionAddress: string) {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getCollectionInfoQueryKey(collectionAddress, node),
    queryFn: () => queryCollectionInfo(collectionAddress, node),
    enabled: !!collectionAddress && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

async function queryTokenInfo(
  collectionAddress: string,
  tokenId: string,
  node: Node,
) {
  const allInfoQuery = {
    all_nft_info: {
      token_id: tokenId,
    },
  };
  return queryCW<CW721AllTokenInfo>(collectionAddress, allInfoQuery, {
    node,
    errorMessage: "Error querying NFT all token info",
  });
}

export function getTokenInfoQueryKey(
  collectionAddress: string,
  tokenId: string,
  node: Node,
) {
  return ["tokenInfo", collectionAddress, tokenId, node];
}

export function useTokenInfo(collectionAddress: string, tokenId: string) {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getTokenInfoQueryKey(collectionAddress, tokenId, node),
    queryFn: () => queryTokenInfo(collectionAddress, tokenId, node),
    enabled: !!collectionAddress && !!tokenId && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

export function getTokenMetadataQueryKey(
  collectionAddress: string,
  tokenId: string,
  node: Node,
) {
  return ["tokenMetadata", collectionAddress, tokenId, node];
}

export function useTokenMetadata(
  collectionAddress: string,
  tokenUri: string | undefined,
  tokenId: string,
) {
  const {
    settings: { node },
  } = useSettingsStore();
  return useQuery({
    queryKey: getTokenMetadataQueryKey(collectionAddress, tokenId, node),
    queryFn: () => fetchTokenMetadata(tokenUri, tokenId),
    enabled: !!collectionAddress && !!tokenUri && !!tokenId && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

export type PaginationParams = {
  limit?: number;
  startAfter?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    hasMore: boolean;
    nextStartAfter?: string;
  };
};

export async function queryCollectionTokens(
  contractAddress: string,
  collectionInfo: CW721CollectionInfo,
  ownerAddress: string,
  node: Node,
  { limit = 10, startAfter }: PaginationParams = {},
): Promise<PaginatedResponse<NFTInfo>> {
  try {
    const tokensQuery = {
      tokens: {
        owner: ownerAddress,
        start_after: startAfter,
        limit: limit + 1, // Request one extra item to determine if there are more
      },
    };

    const { tokens } = await queryCW<CW721Tokens>(
      contractAddress,
      tokensQuery,
      { node, errorMessage: "Error querying NFT tokens" },
    );

    const hasMore = tokens.length > limit;
    const paginatedTokens = tokens.slice(0, limit);

    const nftInfoPromises = paginatedTokens.map<Promise<NFTInfo>>(
      async (tokenId: string) => {
        const allInfoQuery = {
          all_nft_info: {
            token_id: tokenId,
          },
        };

        const allTokenInfo = await queryCW<CW721AllTokenInfo>(
          contractAddress,
          allInfoQuery,
          { node, errorMessage: "Error querying NFT all token info" },
        );
        const tokenMetadata = await fetchTokenMetadata(
          allTokenInfo.info.token_uri,
          tokenId,
        );

        return {
          tokenId,
          collection: {
            ...collectionInfo,
            contractAddress,
          },
          tokenMetadata,
          access: allTokenInfo.access,
          info: allTokenInfo.info,
        };
      },
    );

    const nftInfos = await Promise.all(nftInfoPromises);

    return {
      data: nftInfos,
      pagination: {
        hasMore,
        nextStartAfter: hasMore
          ? paginatedTokens[paginatedTokens.length - 1]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to query collection tokens:", error);
    throw new Error("Failed to query collection tokens");
  }
}

export async function queryAllCollectionTokens(
  contractAddress: string,
  ownerAddress: string,
  node: Node,
  pageSize = 10,
): Promise<NFTInfo[]> {
  const collectionInfo = await queryCollectionInfo(contractAddress, node);
  const allTokens: NFTInfo[] = [];
  let startAfter: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await queryCollectionTokens(
      contractAddress,
      collectionInfo,
      ownerAddress,
      node,
      {
        limit: pageSize,
        startAfter,
      },
    );

    allTokens.push(...response.data);
    hasMore = response.pagination.hasMore;
    startAfter = response.pagination.nextStartAfter;
  }

  return allTokens;
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
        return await queryAllCollectionTokens(
          contractAddress,
          ownerAddress,
          node,
        );
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
    staleTime: Infinity,
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
  const activeAccountCodeIdsQuery = useActiveAccountCodeIds();
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
    enabled:
      !!activeAccount?.address &&
      !!contractAddressesQuery.data &&
      !!activeAccountCodeIdsQuery.data,
    staleTime: LONG_STALE_TIME,
  });

  const isLoadingCodes =
    codesQuery.isLoading &&
    !activeAccountCodeIdsQuery.isLoading &&
    !activeAccountCodeIdsQuery.data?.length;

  const listStates = {
    isLoadingCodes: isLoadingCodes,

    isLoading:
      nfts.isLoading ||
      contractAddressesQuery.isLoading ||
      activeAccountCodeIdsQuery.isLoading ||
      isLoadingCodes,

    isError:
      nfts.isError ||
      contractAddressesQuery.isError ||
      codesQuery.isError ||
      activeAccountCodeIdsQuery.isError,

    isEmpty: nfts.isSuccess && nfts.data?.length === 0,

    isSuccess: nfts.isSuccess && nfts.data?.length > 0,
  };

  return {
    nfts,
    contractAddressesQuery,
    codesQuery,
    activeAccountCodeIdsQuery,
    listStates,
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
  codeIds: number[] | undefined,
  node: Node,
) {
  return ["contractAddresses", activeAccountAddress, codeIds, node];
}

async function fetchActiveAccountCodeIds(
  activeAccountAddress: Account["address"] | undefined,
  codes: Codes | undefined,
) {
  const storedCodeIds = await loadFromStorage<number[]>("codeIds", []);

  if (!codes) {
    return storedCodeIds;
  }
  const currentCodeIds = getCodeIdsByOwner(codes, activeAccountAddress);
  await saveToStorage("codeIds", currentCodeIds);

  return currentCodeIds;
}

function getActiveAccountCodeIdsQueryKey(
  activeAccountAddress: Account["address"] | undefined,
  codes: Codes | undefined,
  node: Node,
) {
  return ["activeAccountCodeIds", activeAccountAddress, codes, node];
}

export function useActiveAccountCodeIds() {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const codes = useCodes();
  return useQuery({
    queryKey: getActiveAccountCodeIdsQueryKey(
      activeAccount?.address,
      codes.data,
      node,
    ),
    queryFn: () =>
      fetchActiveAccountCodeIds(activeAccount?.address, codes.data),
    enabled: !!activeAccount?.address && !!node,
    staleTime: LONG_STALE_TIME,
  });
}

function useContractAddresses() {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const activeAccountCodeIds = useActiveAccountCodeIds();
  const contractAddresses = useQuery({
    queryKey: getContractAddressesQueryKey(
      activeAccount?.address,
      activeAccountCodeIds.data,
      node,
    ),
    queryFn: () =>
      getContractAddressesByCodeIds(activeAccountCodeIds.data, node),
    enabled: !!activeAccount?.address && !!activeAccountCodeIds.data && !!node,
    staleTime: LONG_STALE_TIME,
  });
  return contractAddresses;
}

export function useNFTCollections() {
  const { nfts } = useNFTs();
  const filterHiddenNFTs = useFilterHiddenNFTs();
  const filteredNFTs = filterNFTs(nfts.data ?? [], undefined, filterHiddenNFTs);
  return groupNFTsByCollection(filteredNFTs);
}

export function useNFTCollection(collectionAddress: string) {
  const collections = useNFTCollections();
  return collections.find(
    (collection) => collection.contractAddress === collectionAddress,
  );
}
