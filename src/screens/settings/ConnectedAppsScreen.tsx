import { format } from "date-fns";
import {
  Box,
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
import { Path, Svg } from "react-native-svg";
import { CloseCircle, ScanBarcode, SearchNormal } from "iconsax-react-native";
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ position: "relative", marginBottom: 20 }}>
            <Svg width="81" height="81" viewBox="0 0 81 81" fill="none">
              <Path
                d="M40.4588 10.9918C52.9642 13.3785 68.5746 7.41877 76.144 17.6551C84.1334 28.4594 79.8267 43.9518 73.6601 55.8906C68.1426 66.5727 57.4354 72.5017 45.9607 76.0909C34.0793 79.8074 18.7339 84.9643 10.4655 75.6577C2.4042 66.5843 16.3902 53.4306 15.1056 41.3617C13.6335 27.5307 -6.11173 14.3348 2.80196 3.65732C11.4243 -6.67108 27.243 8.46949 40.4588 10.9918Z"
                fill="#1D1D1D"
              />
            </Svg>
            <SearchNormal
              style={{ position: "absolute", top: 5, left: 5 }}
              size={71}
              color={Colors.text400}
            />
          </View>
          <Text
            style={{
              color: Colors.text400,
              fontSize: FontSizes.lg,
              fontFamily: FontWeights.bold,
              marginBottom: 10,
            }}
          >
            No connected apps found
          </Text>
          <Text style={{ color: Colors.text400 }}>
            Scan the QR code to connect your first app.
          </Text>
        </View>
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
