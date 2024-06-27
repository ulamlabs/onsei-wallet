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
} from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import {
  useAccountsStore,
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
  InfoCircle,
  ScanBarcode,
  Setting2,
} from "iconsax-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { TokensList } from "../tokens";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();
  const {
    settings: { globalGasPrice },
    setSetting,
  } = useSettingsStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.navigate("Your SEI address");
  }
  function onSend() {
    setSetting("localGasPrice", globalGasPrice);
    navigation.navigate("transferSelectAddress");
  }
  function onScan() {
    navigation.push("Connect Wallet");
  }
  async function onRefresh() {
    await refreshRegistryCache();
    updateBalances();
  }

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
              backgroundColor: Colors.background100,
              borderRadius: 30,
            }}
          >
            <InfoCircle size={16} color={Colors.text100} />
            <Text style={{ color: Colors.text100 }}>
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
      <DashboardHeader>
        <TouchableOpacity onPress={openSettings}>
          <Setting2 size={22} color={Colors.text100} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Wallets")}
          style={{ flexDirection: "row", gap: 4 }}
        >
          <Row style={{ gap: 4 }}>
            {activeAccount?.passphraseSkipped && <NoBackupIcon />}
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
        style={{ paddingTop: 24, paddingBottom: 65 }}
        refreshFn={onRefresh}
      >
        <Column style={{ alignItems: "center" }}>{render()}</Column>
        <Row
          style={{
            justifyContent: "space-around",
            marginVertical: 30,
          }}
        >
          <SecondaryButton
            title="Send"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onSend}
            icon={ArrowUp}
          />
          <SecondaryButton
            title="Receive"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onReceive}
            icon={ArrowDown}
          />
          <SecondaryButton
            title="Scan"
            style={{ paddingHorizontal: 20, flex: 1 }}
            onPress={onScan}
            icon={ScanBarcode}
          />
        </Row>
        <TokensList />
      </SafeLayout>
    </>
  );
}
