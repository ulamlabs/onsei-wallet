import { NavigatorParamsList } from "@/types";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CloseIcon, PrimaryButton, SafeLayout, Text } from "@/components";
import { TouchableOpacity, View, StyleSheet, FlatList } from "react-native";
import Avatar from "@/components/Avatar";
import { Colors } from "@/styles";
import { Account, useAccountsStore } from "@/store";
import { useState } from "react";
import { NFTGalleryCard } from "@/screens/nftsGallery/NFTsGalleryList";
import { FontWeights, FontSizes } from "@/styles";
import { useNFTs } from "@/modules/nfts/api";
import { getNFTImage } from "../nftsGallery/utils";
import CenteredLoader from "@/components/CenteredLoader";
import ErrorNFTsGallery from "../nftsGallery/ErrorNFTsGallery";
import EmptyNFTsGallery from "../nftsGallery/EmptyNFTsGallery";

type ChooseWalletAvatarScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Choose Wallet Avatar"
>;

const CARDS_GAP = 16;

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
  const { setAvatar } = useAccountsStore();
  const [activeTab, setActiveTab] = useState<Tab>("NFT Collection");
  const { nfts, listStates } = useNFTs();

  const handleSavePress = () => {
    setAvatar(account?.address, draftAvatar);
    navigation.goBack();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "NFT Collection":
        return (
          <View>
            {(listStates.isLoading ||
              listStates.isEmpty ||
              listStates.isError) && (
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
            {listStates.isSuccess && (
              <FlatList
                key="nfts"
                data={nfts.data}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.flatList}
                keyExtractor={(item) => item.tokenId}
                renderItem={({ item }) => (
                  <NFTGalleryCard
                    nft={item}
                    onPress={() => setDraftAvatar(getNFTImage(item))}
                  />
                )}
                columnWrapperStyle={styles.columnWrapper}
              />
            )}
            <PrimaryButton
              title="Save"
              onPress={handleSavePress}
              disabled={draftAvatar === account?.avatar}
              style={{
                position: "absolute",
                top: 360,
                left: 0,
                right: 0,
              }}
            />
          </View>
        );
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
    <SafeLayout subScreen style={{ position: "relative" }}>
      <View>
        {account && (
          <TouchableOpacity
            style={{ position: "relative", alignItems: "center" }}
            onPress={handleAvatarPress}
          >
            <Avatar
              src={draftAvatar || account?.avatar}
              name={account?.name}
              size={144}
              rounded
            />
            {(draftAvatar || account?.avatar) && (
              <View
                style={{
                  position: "absolute",
                  bottom: -8,
                  right: 144 / 2 + 24 + 16,
                  borderRadius: 300,
                  backgroundColor: Colors.tokenBoxBackground,
                  borderWidth: 3,
                  borderColor: Colors.background,
                  width: 38,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloseIcon size={18} color={Colors.text} />
              </View>
            )}
          </TouchableOpacity>
        )}

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
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
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
  flatList: {
    gap: CARDS_GAP,
  },
  columnWrapper: {
    gap: CARDS_GAP,
  },
});
