import tw from "@/lib/tailwind";
import React from "react";
import { Text, View, FlatList } from "react-native";
import { scale, verticalScale } from "../utils";

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
    <Text style={tw`mr-2 opacity-50 text-white`}>{id}.</Text>
    <Text style={tw`text-white`}>{title}</Text>
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
