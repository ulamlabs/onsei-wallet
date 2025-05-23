import { Row, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useDAppsStore } from "@/store";
import React from "react";

export default function UrlBar() {
  const { url, setUrl } = useDAppsStore();
  const searchInput = useInputState({ initialValue: url });

  return (
    <Row>
      <TextInput
        {...searchInput}
        keyboardType="web-search"
        onSubmitEditing={() => setUrl(searchInput.value)}
        containerStyle={{ width: "100%" }}
      />
    </Row>
  );
}
