import React, { useRef } from "react";
import Browser from "./Browser";
import { SafeLayout } from "@/components";
import UrlBar from "./UrlBar";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import WebView from "react-native-webview";
import { useDAppsStore } from "@/store";
import HistoryScreen from "./HistoryScreen";

export default function DApps() {
  const webviewRef = useRef<WebView | null>(null);
  const { isFocused } = useDAppsStore();

  return (
    <>
      <DashboardHeader>
        <UrlBar webviewRef={webviewRef} />
      </DashboardHeader>
      <SafeLayout>
        {isFocused ? <HistoryScreen /> : <Browser webviewRef={webviewRef} />}
      </SafeLayout>
    </>
  );
}
