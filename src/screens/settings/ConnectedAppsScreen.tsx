import { format } from "date-fns";
import {
  Box,
  EmptyList,
  IconButton,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
} from "@/components";
import { useModalStore, useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo } from "react";
import { View, Image, Pressable, FlatList } from "react-native";
import { CloseCircle, ScanBarcode } from "iconsax-react-native";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { disconnectApp } from "@/web3wallet/utils";
import { WalletConnectSession } from "@/web3wallet/types";

type ScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Connected Apps"
>;

type SessionBoxProps = {
  session: WalletConnectSession;
  onRemove: (topic: string) => void;
};

function SessionBox({ session, onRemove }: SessionBoxProps) {
  return (
    <Box>
      <Row style={{ justifyContent: "flex-start" }}>
        <Image
          source={{
            uri: session.icon,
          }}
          style={{ width: 32, height: 32 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: FontSizes.base,
              fontFamily: FontWeights.bold,
            }}
          >
            {session.appName}
          </Text>
          <Text style={{ color: Colors.text100 }}>
            Added {format(Number(session.timestamp), "HH:mm dd.LL.yyyy")}
          </Text>
        </View>
        <Pressable
          style={{
            backgroundColor: Colors.background100,
            borderRadius: 100,
          }}
          onPress={() => onRemove(session.topic)}
        >
          <CloseCircle variant="Bold" size={22} color={Colors.text100} />
        </Pressable>
      </Row>
    </Box>
  );
}

export default function ConnectedAppsScreen({ navigation }: ScreenProps) {
  const { settings } = useSettingsStore();
  const { ask } = useModalStore();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          style={{ backgroundColor: "transparent" }}
          icon={ScanBarcode}
          onPress={() => navigation.push("Connect Wallet")}
        />
      ),
    });
  }, []);

  const sessions = useMemo(() => {
    if (!settings["walletConnet.sessions"]) {
      return [];
    }

    return settings["walletConnet.sessions"];
  }, [settings["walletConnet.sessions"]]);

  async function onSessionRemove(sessionTopic: string) {
    const yesno = await ask({
      title: "Removing a connected app",
      question:
        "Make sure you want to permanently remove the currently connected app from your wallet.",
      yes: "Remove app",
      no: "Cancel",
      primary: "yes",
    });
    if (yesno) {
      disconnectApp(sessionTopic);
    }
  }

  async function onRemoveAll() {
    const yesno = await ask({
      title: "Removing all connected apps",
      question:
        "Make sure you want to permanently remove the all connected apps from your wallet.",
      yes: "Remove all apps",
      no: "Cancel",
      primary: "yes",
    });
    if (yesno) {
      for (const session of sessions) {
        disconnectApp(session.topic);
      }
    }
  }

  function renderSessions() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <FlatList
            data={sessions}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item: session }) => (
              <SessionBox
                key={session.topic}
                session={session}
                onRemove={(topic) => onSessionRemove(topic)}
              />
            )}
          />
        </View>

        <SecondaryButton title="Remove all apps" onPress={onRemoveAll} />
      </>
    );
  }

  function renderEmptyView() {
    return (
      <>
        <EmptyList
          title="No connected apps found"
          description="Scan the QR code to connect your first app."
        />

        <SecondaryButton
          title="Scan QR code"
          onPress={() => navigation.push("Connect Wallet")}
        />
      </>
    );
  }

  return (
    <SafeLayout staticView={true}>
      {sessions.length > 0 ? renderSessions() : renderEmptyView()}
    </SafeLayout>
  );
}
