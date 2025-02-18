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
import {
  formatIpfsToHttpUrl,
  NFTInfo,
  useCollectionInfo,
  useInvalidateNFTs,
} from "@/modules/nfts/api";
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
import NFTDetailsScreen from "./NFTDetails";
import FullScreenModal from "@/components/modals/FullScreenModal";
import { useAccountsStore, useToastStore } from "@/store";

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
    <Card
      imageSrc={collection.firstNftImage}
      title={
        collectionInfo.isLoading ? (
          <Skeleton width={100} height={20} />
        ) : (
          formatCollectionName(collection.address, collectionInfo.data?.name)
        )
      }
      subtitle={pluralize(collection.nfts.length, "NFT")}
      imageStyle={{
        height: cardSize,
        borderRadius: 18,
      }}
    />
  );
}

type SortOption =
  | "newest"
  | "oldest"
  | "highest-value"
  | "lowest-value"
  | "collections";

type NFTsGalleryListProps = {
  nfts: NFTInfo[];
};

export default function NFTsGalleryList({ nfts }: NFTsGalleryListProps) {
  const { isNFTHidden, hideNFT, showNFT } = useNFTsGalleryStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "collections">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const buttonRef = useRef<View>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedNFT, setSelectedNFT] = useState<NFTInfo | null>(null);
  const { setAvatar, activeAccount } = useAccountsStore();
  const invalidateNFTs = useInvalidateNFTs();
  const { error, info } = useToastStore();
  const [isImageValid, setIsImageValid] = useState<boolean | null>(null);

  const filteredNFTs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return nfts.filter((nft) => {
      if (isNFTHidden(nft)) {
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
  }, [nfts, searchQuery, isNFTHidden]);

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
        (nft) => !isNFTHidden(nft) && getNFTImage(nft),
      );

      const firstNftImage = getNFTImage(images[0]);

      return {
        address,
        nfts,
        firstNftImage,
      };
    });
  }, [filteredNFTs, isNFTHidden]);

  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Value", value: "highest-value" },
    { label: "Lowest Value", value: "lowest-value" },
    { label: "Collections", value: "collections" },
  ];

  function handleSort(option: SortOption) {
    setSortOption(option);
  }

  const handleSetAvatar = () => {
    if (!selectedNFT) {
      error({ description: "NFT not selected" });
      return;
    }
    if (!activeAccount?.address) {
      error({ description: "No active account" });
      return;
    }
    const imageSrc = getNFTImage(selectedNFT);
    if (imageSrc) {
      setAvatar(activeAccount.address, formatIpfsToHttpUrl(imageSrc));
      info({ description: "Avatar updated successfully" });
    } else {
      error({ description: "Image not available" });
    }
  };

  const handleToggleVisibility = () => {
    if (!selectedNFT?.collectionAddress) {
      error({ description: "Collection address not available" });
      return;
    }
    if (isNFTHidden(selectedNFT)) {
      showNFT(selectedNFT);
      info({ description: "Collection is now visible" });
    } else {
      hideNFT(selectedNFT);
      info({ description: "Collection is now hidden" });
    }
    invalidateNFTs();
  };

  function getFullScreenModalTitle() {
    const defaultTitle = "NFT Details";
    if (!selectedNFT) {
      return defaultTitle;
    }
    return getNFTName(selectedNFT) || defaultTitle;
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

      {activeFilter === "all" ? (
        <FlatList
          key="nfts"
          data={filteredNFTs}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.tokenId}
          renderItem={({ item }) => (
            <NFTGalleryCard nft={item} onPress={() => setSelectedNFT(item)} />
          )}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <FlatList
          key="collections"
          data={collections}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => <CollectionCard collection={item} />}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      {/* TODO: navigate to NFT details screen instead of using a modal */}
      <FullScreenModal
        isVisible={!!selectedNFT}
        onBackdropPress={() => setSelectedNFT(null)}
        title={getFullScreenModalTitle()}
        moreOptions={[
          {
            label: "Set as wallet avatar",
            value: "avatar",
            onPress: handleSetAvatar,
            disabled: !isImageValid,
          },
          {
            label:
              selectedNFT?.collectionAddress && isNFTHidden(selectedNFT)
                ? "Show NFT"
                : "Hide NFT",
            value: "visibility",
            onPress: handleToggleVisibility,
            disabled: true,
          },
        ]}
      >
        {selectedNFT && (
          <NFTDetailsScreen
            nft={selectedNFT}
            isImageValid={!!isImageValid}
            onImageError={() => setIsImageValid(false)}
            onImageLoad={() => setIsImageValid(true)}
          />
        )}
      </FullScreenModal>
    </View>
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
  flatList: {
    gap: CARDS_GAP,
    marginTop: 32,
  },
  columnWrapper: {
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
