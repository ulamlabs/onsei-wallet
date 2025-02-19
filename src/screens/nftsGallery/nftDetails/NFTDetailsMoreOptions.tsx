import { useAccountsStore, useToastStore } from "@/store";
import { formatIpfsToHttpUrl, NFTInfo } from "@/modules/nfts/api";
import { getNFTImage } from "@/screens/nftsGallery/utils";
import MoreOptions from "@/components/MoreOptions";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import useImageValidation from "@/hooks/useImageValidation";

export default function NFTDetailsMoreOptions({ nft }: { nft: NFTInfo }) {
  const imageSrc = getNFTImage(nft);
  const [isImageValid] = useImageValidation(imageSrc);

  const { activeAccount, setAvatar } = useAccountsStore();
  const { isNFTHidden, showNFT, hideNFT } = useNFTsGalleryStore();
  const { error, info } = useToastStore();

  const handleSetAvatar = () => {
    if (!nft) {
      error({ description: "NFT not selected" });
      return;
    }
    if (!activeAccount?.address) {
      error({ description: "No active account" });
      return;
    }

    if (imageSrc) {
      setAvatar(activeAccount.address, formatIpfsToHttpUrl(imageSrc));
      info({ description: "Avatar updated successfully" });
    } else {
      error({ description: "Image not available" });
    }
  };

  const handleToggleVisibility = () => {
    if (!nft) {
      error({ description: "NFT not selected" });
      return;
    }
    if (!activeAccount?.address) {
      error({ description: "No active account" });
      return;
    }
    if (isNFTHidden(nft, activeAccount.address)) {
      showNFT(nft, activeAccount.address);
      info({ description: "NFT is now visible" });
    } else {
      hideNFT(nft, activeAccount.address);
      info({ description: "NFT is now hidden" });
    }
  };

  return (
    <MoreOptions
      options={[
        {
          label: "Set as wallet avatar",
          value: "avatar",
          onPress: handleSetAvatar,
          disabled: !isImageValid,
        },
        {
          label:
            nft.collectionAddress &&
            activeAccount?.address &&
            isNFTHidden(nft, activeAccount.address)
              ? "Show NFT"
              : "Hide NFT",
          value: "visibility",
          onPress: handleToggleVisibility,
          disabled: !activeAccount?.address,
        },
      ]}
    />
  );
}
