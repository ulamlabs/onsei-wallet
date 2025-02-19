import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { IconButton, Text } from "@/components";
import React, { useMemo, useRef, useState } from "react";
import Card from "../../components/Card";
import pluralize from "@/utils/pluralize";
import SearchInput from "@/components/forms/SearchInput";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { NFTInfo, useCollectionInfo } from "@/modules/nfts/api";
import {
  formatTokenId,
  getNFTAttributes,
  getNFTImage,
  getNFTName,
} from "./utils";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { APP_HORIZONTAL_PADDING } from "@/const";
import Skeleton from "@/components/Skeleton";
import { Sort } from "iconsax-react-native";
import { Dropdown } from "@/components/Dropdown";
import { useAccountsStore } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import CardHorizontal from "@/components/CardHorizontal";

const UNKNOWN_COLLECTION_ADDRESS = "Uncategorized";

type Collection = {
  address: string;
  nfts: NFTInfo[];
  firstNftImage: string | null;
};

function formatCollectionName(
  collectionAddress: string,
  collectionName: string | undefined,
) {
  return collectionAddress === UNKNOWN_COLLECTION_ADDRESS
    ? "Uncategorized"
    : collectionName || "Unknown collection";
}

function formatAllFilterTag(count: number) {
  return `All (${count})`;
}

const CARDS_GAP = 16;
const cardSize =
  (Dimensions.get("window").width - CARDS_GAP - 2 * APP_HORIZONTAL_PADDING) / 2;

type NFTGalleryCardProps = {
  nft: NFTInfo;
  onPress: () => void;
};

export function NFTGalleryCard({ nft, onPress }: NFTGalleryCardProps) {
  const image = getNFTImage(nft);
  const collection = useCollectionInfo(nft.collectionAddress);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        imageSrc={image}
        title={
          collection.isLoading ? (
            <Skeleton width={100} height={19.2} />
          ) : (
            formatCollectionName(nft.collectionAddress, collection.data?.name)
          )
        }
        subtitle={formatTokenId(nft.tokenId)}
        imageStyle={{
          height: cardSize,
          borderRadius: 18,
        }}
      />
    </TouchableOpacity>
  );
}

type CollectionCardProps = {
  collection: Collection;
};

function CollectionCard({ collection }: CollectionCardProps) {
  const collectionInfo = useCollectionInfo(collection.address);

  return (
    <CardHorizontal
      imageSrc={collection.firstNftImage}
      title={
        collectionInfo.isLoading ? (
          <Skeleton width={100} height={20} />
        ) : (
          formatCollectionName(collection.address, collectionInfo.data?.name)
        )
      }
      subtitle={pluralize(collection.nfts.length, "item")}
    />
  );
}

type SortOption =
  | "newest"
  | "oldest"
  | "highest-value"
  | "lowest-value"
  | "collections";

type NFTsGalleryContentProps = {
  nfts: NFTInfo[];
};

export default function NFTsGalleryContent({ nfts }: NFTsGalleryContentProps) {
  const navigation = useNavigation<NavigationProp>();
  const { isNFTHidden, hiddenNFTs } = useNFTsGalleryStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "collections">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const buttonRef = useRef<View>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const { activeAccount } = useAccountsStore();

  const filteredNFTs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return nfts.filter((nft) => {
      if (activeAccount?.address && isNFTHidden(nft, activeAccount.address)) {
        return false;
      }
      const name = getNFTName(nft);
      const attributes = getNFTAttributes(nft);

      const matchesName = name?.toLowerCase().includes(query);
      const matchesCollection = (
        nft.collectionAddress || UNKNOWN_COLLECTION_ADDRESS
      )
        .toLowerCase()
        .includes(query);
      const matchesAttributes = attributes?.some(
        (attribute) =>
          attribute.value?.toLowerCase().includes(query) ||
          attribute.trait_type.toLowerCase().includes(query),
      );

      return matchesName || matchesCollection || matchesAttributes;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, nfts, activeAccount?.address, isNFTHidden, hiddenNFTs]);

  const collections: Collection[] = useMemo(() => {
    const grouped = filteredNFTs.reduce<Record<string, typeof filteredNFTs>>(
      (acc, nft) => {
        const collectionAddress =
          nft.collectionAddress || UNKNOWN_COLLECTION_ADDRESS;
        if (!acc[collectionAddress]) {
          acc[collectionAddress] = [];
        }
        acc[collectionAddress].push(nft);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([address, nfts]) => {
      const images = nfts.filter(
        (nft) =>
          activeAccount?.address &&
          !isNFTHidden(nft, activeAccount.address) &&
          getNFTImage(nft),
      );

      const firstNftImage = images.length > 0 ? getNFTImage(images[0]) : null;

      return {
        address,
        nfts,
        firstNftImage,
      };
    });
  }, [activeAccount?.address, filteredNFTs, isNFTHidden]);

  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Value", value: "highest-value" },
    { label: "Lowest Value", value: "lowest-value" },
  ];

  function handleSort(option: SortOption) {
    setSortOption(option);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, collection or attributes..."
          containerStyle={styles.searchInput}
        />
        <View style={styles.sortButtonContainer}>
          <View ref={buttonRef}>
            <IconButton
              icon={Sort}
              onPress={() => setShowSortDropdown((prev) => !prev)}
              style={styles.sortButton}
              iconSize={FontSizes.base}
              iconColor={Colors.text100}
            />
          </View>
          <Dropdown
            visible={showSortDropdown}
            onClose={() => setShowSortDropdown(false)}
            onSelect={handleSort}
            options={sortOptions}
            buttonRef={buttonRef}
            value={sortOption}
            disabled={true}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText,
            ]}
          >
            {formatAllFilterTag(filteredNFTs.length)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "collections" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("collections")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "collections" && styles.activeFilterText,
            ]}
          >
            Collections
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {activeFilter === "all" ? (
          <NFTsGalleryList
            nfts={filteredNFTs}
            onItemPress={(nft) => navigation.navigate("NFT Details", { nft })}
          />
        ) : (
          <CollectionsList collections={collections} />
        )}
      </View>
    </View>
  );
}

type NFTsGalleryListProps = {
  nfts: NFTInfo[];
  onItemPress: (nft: NFTInfo) => void;
};

export function NFTsGalleryList({ nfts, onItemPress }: NFTsGalleryListProps) {
  return (
    <FlatList
      key="nfts"
      data={nfts}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={styles.flatList}
      keyExtractor={(item) => item.tokenId}
      renderItem={({ item }) => (
        <NFTGalleryCard nft={item} onPress={() => onItemPress(item)} />
      )}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

type CollectionsListProps = {
  collections: Collection[];
};

function CollectionsList({ collections }: CollectionsListProps) {
  return (
    <FlatList
      key="collections"
      data={collections}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={styles.collectionsFlatList}
      keyExtractor={(item) => item.address}
      renderItem={({ item }) => <CollectionCard collection={item} />}
      columnWrapperStyle={styles.collectionsColumnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: Colors.background,
    borderColor: Colors.inputBorderColor,
    borderWidth: 1,
  },
  activeFilter: {
    borderColor: Colors.markerBackground,
  },
  filterText: {
    color: Colors.text100,
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.sm,
    letterSpacing: 0,
    lineHeight: 21,
  },
  activeFilterText: {
    color: Colors.text,
  },
  listContainer: {
    marginTop: 16,
  },
  flatList: {
    gap: CARDS_GAP,
  },
  columnWrapper: {
    gap: CARDS_GAP,
  },
  collectionsFlatList: {
    gap: CARDS_GAP,
  },
  collectionsColumnWrapper: {
    gap: CARDS_GAP,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    zIndex: 1000,
  },
  searchInput: {
    flex: 1,
    height: 48,
  },
  sortButtonContainer: {
    position: "relative",
    zIndex: 1001,
  },
  sortButton: {
    borderWidth: 1,
    backgroundColor: Colors.background100,
    borderColor: Colors.inputBorderColor,
    borderRadius: 18,
    padding: 16,
    height: 48,
    width: 48,
  },
});
