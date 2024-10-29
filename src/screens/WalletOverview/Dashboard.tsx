import {
  Column,
  CopyAddress,
  Headline,
  Loader,
  NoBackupIcon,
  Paragraph,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
  TextLink,
} from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import {
  useAccountsStore,
  useModalStore,
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateTotalBalance } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowDown,
  ArrowDown2,
  ArrowUp,
  ClipboardTick,
  InfoCircle,
  Setting2,
} from "iconsax-react-native";
import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { TokensList } from "../tokens";

const DASHBOARD_IMG = require("../../../assets/dashboard-image.png");

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();
  const { ask } = useModalStore();
  const {
    settings: { globalGasPrice, acceptedNewTerms },
    setSetting,
  } = useSettingsStore();
  const {
    settings: { node },
  } = useSettingsStore();
  // const requiresAction = useMemo(
  //   () => activeAccount?.passphraseSkipped || !activeAccount?.addressLinked,
  //   [activeAccount],
  // ); // TODO: use again when mainnet and evm ready

  function onReceive() {
    navigation.navigate("Your SEI address");
  }
  function onSend() {
    setSetting("localGasPrice", globalGasPrice);
    navigation.navigate("transferSelectAddress");
  }
  // function onScan() {
  //   navigation.push("Connect Wallet");
  //  TODO: use again when mainnet ready}
  async function onRefresh() {
    await refreshRegistryCache();
    updateBalances();
  }

  useEffect(() => {
    if (acceptedNewTerms) {
      return;
    }
    (async () => {
      const yesno = await ask({
        title: "Terms of Use and Privacy Policy update.",
        question: (
          <View
            style={{
              flexDirection: "row",
              columnGap: 4,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Paragraph>Our</Paragraph>
            <TextLink
              url="https://www.onseiwallet.io/terms-and-conditions"
              text="Terms of Use"
            />
            <Paragraph>and</Paragraph>
            <TextLink
              url="https://www.onseiwallet.io/privacy-policy"
              text="Privacy Policy"
            />
            <Paragraph>have been</Paragraph>
            <Paragraph>
              recently updated. To continue using the app please review to our
              updated terms.
            </Paragraph>
          </View>
        ),
        yes: "Confirm",
        no: "Learn more",
        primary: "yes",
        icon: ClipboardTick,
        showCloseButton: false,
        noTopBar: true,
        cancelLink: "https://www.onseiwallet.io/learn-more",
      });
      if (yesno) {
        setSetting("acceptedNewTerms", true);
      }
    })();
  }, [acceptedNewTerms]);

  function render() {
    const hasTokensWithoutPrice = tokens.some((token) => !token.price);
    if (!activeAccount) {
      return <Loader />;
    }

    return (
      <>
        {node === "TestNet" && (
          <Row
            style={{
              backgroundColor: Colors.markerBackground,
              paddingVertical: 12,
              justifyContent: "center",
              width: "100%",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: FontSizes.base,
                fontFamily: FontWeights.bold,
                color: Colors.markerText,
              }}
            >
              Testnet mode
            </Text>
          </Row>
        )}
        <Headline size="2xl" style={{ marginBottom: 0 }}>
          ${calculateTotalBalance(tokens)}
        </Headline>
        {hasTokensWithoutPrice && (
          <Row
            style={{
              gap: 6,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: Colors.backgroundOpacity,
              borderRadius: 30,
            }}
          >
            <InfoCircle size={16} color={Colors.dashboardMenu} />
            <Text
              style={{ color: Colors.dashboardMenu, fontSize: FontSizes.base }}
            >
              Excludes unknown value assets
            </Text>
          </Row>
        )}
      </>
    );
  }

  function openSettings() {
    navigation.navigate("Settings");
  }

  return (
    <>
      <DashboardHeader style={{ backgroundColor: "transparent" }}>
        <TouchableOpacity testID="settings" onPress={openSettings}>
          <Setting2 size={22} color={Colors.dashboardMenu} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Wallets")}
          style={{ flexDirection: "row", gap: 4 }}
        >
          <Row style={{ gap: 4 }}>
            {activeAccount?.passphraseSkipped && ( // Todo: use again requiresAction when mainnet and evm ready
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    width: 14,
                    height: 14,
                    backgroundColor: Colors.text,
                    borderRadius: 999,
                  }}
                ></View>
                <NoBackupIcon />
                {/* {activeAccount?.passphraseSkipped ? (
                  <NoBackupIcon />
                ) : (
                  <LinkIcon />
                )} TODO: use again when mainnet and evm ready */}
              </View>
            )}

            <Paragraph
              style={{
                color: Colors.text,
                fontSize: 18,
                fontFamily: FontWeights.bold,
              }}
            >
              {activeAccount?.name}
            </Paragraph>
            <ArrowDown2 color={Colors.text} />
          </Row>
        </TouchableOpacity>
        <CopyAddress />
      </DashboardHeader>
      <SafeLayout
        style={{ paddingTop: 24, paddingBottom: 80 }}
        refreshFn={onRefresh}
        containerStyle={{ backgroundColor: "transparent" }}
      >
        <Column style={{ alignItems: "center" }}>{render()}</Column>
        <Row
          style={{
            justifyContent: "space-around",
            marginVertical: 32,
            gap: 8,
          }}
        >
          <SecondaryButton
            title="Send"
            style={{ paddingHorizontal: 20, flex: 1, gap: 6 }}
            onPress={onSend}
            icon={ArrowUp}
          />
          <SecondaryButton
            title="Receive"
            style={{ paddingHorizontal: 20, flex: 1, gap: 6 }}
            onPress={onReceive}
            icon={ArrowDown}
          />
          {/* <SecondaryButton
            title="Scan"
            style={{ paddingHorizontal: 20, flex: 1, gap: 6 }}
            onPress={onScan}
            icon={ScanBarcode}
          /> TODO: use again when mainnet ready */}
        </Row>
        <TokensList />
      </SafeLayout>
      <View
        style={{
          position: "absolute",
          zIndex: -1,
          height: "100%",
          width: "100%",
          backgroundColor: Colors.background,
        }}
      >
        <Image
          source={DASHBOARD_IMG}
          style={{ width: "100%", aspectRatio: "1/1", height: "auto" }}
        />
      </View>
    </>
  );
}
