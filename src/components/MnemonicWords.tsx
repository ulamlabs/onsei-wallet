import React from "react";
import { View, FlatList } from "react-native";
import { scale, verticalScale } from "../utils";
import { Colors } from "@/styles";
import { Text } from "./typography";

type ListItemProps = { title: string; id: number };
type MnemonicWordsProps = { mnemonic: string[] };

const ListItem = ({ title, id }: ListItemProps) => (
  <View
    style={{
      flexDirection: "row",
      marginVertical: verticalScale(10),
      marginHorizontal: scale(20),
      width: scale(100),
    }}
  >
    <Text style={{ color: Colors.text100, marginRight: 8 }}>{id}.</Text>
    <Text>{title}</Text>
  </View>
);

export default function MnemonicWords({ mnemonic }: MnemonicWordsProps) {
  return (
    <FlatList
      data={mnemonic}
      numColumns={2}
      scrollEnabled={false}
      renderItem={({ item, index }) => <ListItem title={item} id={index + 1} />}
      keyExtractor={(item) => item}
    />
  );
}
