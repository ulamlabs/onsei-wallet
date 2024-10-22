import { PropsWithChildren } from "react";
import { Column, IconButton, Row, Text, Tooltip } from "@/components";
import WebView from "react-native-webview";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  More,
  Refresh,
  Timer,
} from "iconsax-react-native";
import { useDAppsStore } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import { Pressable, View } from "react-native";
import { Colors } from "@/styles";

type ModalProps = PropsWithChildren & {
  webviewRef: React.MutableRefObject<WebView<object> | null>;
};

export default function BrowserOptions({ webviewRef }: ModalProps) {
  const { setUrl } = useDAppsStore();
  const navigation = useNavigation<NavigationProp>();

  return (
    <Tooltip
      tooltipContent={
        <Column
          style={{
            backgroundColor: Colors.background,
            width: 240,
            borderColor: Colors.inputBorderColor,
            borderWidth: 1,
            borderRadius: 22,
          }}
        >
          <Row
            style={{
              borderBottomWidth: 2,
              borderColor: Colors.inputBorderColor,
              paddingHorizontal: 28,
              paddingVertical: 20,
            }}
          >
            <IconButton
              icon={ArrowLeft}
              onPress={() => {
                if (webviewRef) {
                  webviewRef.current?.goBack();
                }
              }}
            />
            <IconButton
              icon={ArrowRight}
              onPress={() => {
                if (webviewRef) {
                  webviewRef.current?.goForward();
                }
              }}
            />
            <IconButton
              icon={Home}
              onPress={() => {
                if (webviewRef) {
                  setUrl("http://localhost:5173");
                }
              }}
            />
          </Row>
          <Column style={{ paddingHorizontal: 28, paddingVertical: 20 }}>
            <Pressable
              onPress={() => {
                if (webviewRef) {
                  webviewRef.current?.reload();
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 20,
                }}
              >
                <Refresh size={22} color={Colors.text} />
                <Text>Refresh</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("History")}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 20,
                }}
              >
                <Timer size={22} color={Colors.text} />
                <Text>History</Text>
              </View>
            </Pressable>
          </Column>
        </Column>
      }
    >
      <More color="white" />
    </Tooltip>
  );
}
