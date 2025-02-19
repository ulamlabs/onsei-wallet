import { SubScreenHeader } from "@/components/SubScreenHeader";
import { CollectionInfo, useNFTCollection } from "@/modules/nfts/api";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";

type NFTCollectionsScreenHeaderProps = {
  collection: CollectionInfo;
};

export default function NFTCollectionsScreenHeader({
  collection,
}: NFTCollectionsScreenHeaderProps) {
  const navigation = useNavigation<NavigationProp>();
  const collectionData = useNFTCollection(collection.contractAddress);

  return (
    <SubScreenHeader
      title={`Collection: ${collection.name}`}
      subtitle={`(${collectionData?.nfts.length} items)`}
      icon="back"
      onIconPress={() => navigation.goBack()}
    />
  );
}
