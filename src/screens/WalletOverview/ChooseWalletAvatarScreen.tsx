import { NavigatorParamsList } from "@/types";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CloseIcon, PrimaryButton, SafeLayout, Text } from "@/components";
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { EditableAvatar } from "@/components/Avatar";
import { Colors } from "@/styles";
import { Account, useAccountsStore } from "@/store";
import { useState } from "react";
import { NFTsGalleryList } from "@/screens/nftsGallery/NFTsGalleryList";
import { FontWeights, FontSizes } from "@/styles";
import { NFTInfo, useNFTs } from "@/modules/nfts/api";
import { getNFTImage } from "../nftsGallery/utils";
import CenteredLoader from "@/components/CenteredLoader";
import ErrorNFTsGallery from "../nftsGallery/ErrorNFTsGallery";
import EmptyNFTsGallery from "../nftsGallery/EmptyNFTsGallery";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChooseWalletAvatarScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Choose Wallet Avatar"
>;

const AVATAR_SIZE = 144;

const tabs = [
  "NFT Collection",
  // "Emojis"
] as const;
type Tab = (typeof tabs)[number];

export default function ChooseWalletAvatarScreen({
  route: {
    params: { account },
  },
  navigation,
}: ChooseWalletAvatarScreenProps) {
  const [draftAvatar, setDraftAvatar] = useState<Account["avatar"]>(
    account?.avatar,
  );
  console.log("draftAvatar", draftAvatar);
  console.log("account?.avatar", account?.avatar);
  const inset = useSafeAreaInsets();
  const { setAvatar } = useAccountsStore();
  const [activeTab, setActiveTab] = useState<Tab>("NFT Collection");

  const handleSavePress = () => {
    setAvatar(account?.address, draftAvatar);
    navigation.goBack();
  };

  const handleNFTSelect = (nft: NFTInfo) => {
    setDraftAvatar(getNFTImage(nft));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "NFT Collection":
        return <NFTCollectionTab onNFTSelect={handleNFTSelect} />;
      //   case "Emojis":
      //     return <View />;
      default:
        return null;
    }
  };

  const handleAvatarPress = () => {
    setDraftAvatar(null);
    setAvatar(account?.address, null);
  };

  return (
    <SafeLayout subScreen staticView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={{ alignItems: "center" }}>
            {account && (
              <EditableAvatar
                src={draftAvatar}
                name={account?.name}
                size={AVATAR_SIZE}
                rounded
                onPress={handleAvatarPress}
                icon={<CloseIcon size={16} color={Colors.text} />}
                displayIcon={!!draftAvatar}
              />
            )}
          </View>

          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contentContainer}>{renderTabContent()}</View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.buttonWrapper,
          {
            bottom: 144 + inset.bottom,
          },
        ]}
      >
        <PrimaryButton
          title="Save"
          onPress={handleSavePress}
          disabled={draftAvatar === account?.avatar}
        />
      </View>
    </SafeLayout>
  );
}

type NFTCollectionTabProps = {
  onNFTSelect: (nft: NFTInfo) => void;
};

function NFTCollectionTab({ onNFTSelect }: NFTCollectionTabProps) {
  const { nfts, listStates } = useNFTs();

  return (
    <View>
      {(listStates.isLoading || listStates.isEmpty || listStates.isError) && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 50,
          }}
        >
          {listStates.isLoading && <CenteredLoader size="big" />}
          {listStates.isError && <ErrorNFTsGallery />}
          {listStates.isEmpty && <EmptyNFTsGallery />}
        </View>
      )}
      {listStates.isSuccess && nfts.isSuccess && (
        <NFTsGalleryList nfts={nfts.data} onItemPress={onNFTSelect} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  buttonWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 36,
    gap: 24,
    borderBottomWidth: 1,
    borderColor: Colors.inputBorderColor,
  },
  tabButton: {
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderColor: Colors.markerText,
  },
  tabText: {
    color: Colors.text400,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
  },
  activeTabText: {
    color: Colors.text,
  },
  contentContainer: {
    marginTop: 24,
  },
});
