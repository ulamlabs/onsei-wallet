import { Row, Text } from "@/components";
import { useDAppsStore } from "@/store";
import { Colors } from "@/styles";
import React from "react";
import { Image, Pressable } from "react-native";

type Props = {
  url: string;
};

export default function HistoryEntry({ url }: Props) {
  const { setUrl } = useDAppsStore();

  return (
    <Pressable onPress={() => setUrl(url)}>
      <Row style={{ paddingVertical: 16 }}>
        <Image
          style={{ width: 14, height: 14 }}
          source={{
            uri: `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`,
          }}
        />
        <Text style={{ color: Colors.text100, lineHeight: 21, flex: 1 }}>
          {url.split("?")[0]}
        </Text>
      </Row>
    </Pressable>
  );
}
