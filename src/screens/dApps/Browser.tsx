import { useDAppsStore } from "@/store";
import React from "react";
import { WebView } from "react-native-webview";

export default function Browser() {
  const { url } = useDAppsStore();
  console.log(url);
  return (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1 }} // The URL to load in the WebView
    />
  );
}
