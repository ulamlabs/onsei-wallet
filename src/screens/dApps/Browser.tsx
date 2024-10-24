import { useDAppsStore } from "@/store";
import React from "react";
import { WebView, WebViewNavigation } from "react-native-webview";

type Props = {
  webviewRef: React.MutableRefObject<WebView<object> | null>;
};

export default function Browser({ webviewRef }: Props) {
  const { url, setPrev, setNext, history, setHistory } = useDAppsStore();

  const navStateFunction = (navState: WebViewNavigation) => {
    setPrev(navState.canGoBack);
    setNext(navState.canGoForward);
    {
      setHistory([
        navState.url,
        ...history.filter((url) => url !== navState.url),
      ]);
    }
  };

  return (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1 }}
      ref={webviewRef}
      onNavigationStateChange={navStateFunction}
      onLoadStart={(event) => {
        console.log(event.nativeEvent);
      }}
    />
  );
}
