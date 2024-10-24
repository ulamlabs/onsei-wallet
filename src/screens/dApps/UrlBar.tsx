import { IconButton, Row, TextInput } from "@/components";
import BaseButton from "@/components/buttons/BaseButton";
import { useInputState } from "@/hooks";
import { useDAppsStore } from "@/store";
import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { Keyboard } from "react-native";
import WebView from "react-native-webview";
import BrowserOptions from "./BrowserOptions";

type Props = {
  webviewRef: React.MutableRefObject<WebView<object> | null>;
};

export default function UrlBar({ webviewRef }: Props) {
  const { url, setUrl, prev, isFocused, setIsFocused } = useDAppsStore();
  const searchInput = useInputState({ initialValue: url });

  const onCancel = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  return (
    <Row>
      {!isFocused && (
        <IconButton
          icon={ArrowLeft}
          onPress={() => {
            if (webviewRef) {
              webviewRef.current?.goBack();
            }
          }}
          disabled={prev}
        />
      )}
      <TextInput
        {...searchInput}
        keyboardType="web-search"
        onSubmitEditing={() => setUrl(searchInput.value)}
        containerStyle={{ flex: 1 }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {!isFocused && <BrowserOptions webviewRef={webviewRef} />}
      {isFocused && <BaseButton title="Cancel" onPress={() => onCancel()} />}
    </Row>
  );
}
