import React from "react";
import { View, FlatList } from "react-native";
import { Colors } from "@/styles";
import { Text } from "./typography";
import { Row } from "./layout";

type ListItemProps = { title: string; id: number };
type MnemonicWordsProps = { mnemonic: string[] };

const MnemonicChip = ({ title, id }: ListItemProps) => (
  <Row
    style={{
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.inputBorderColor,
      borderRadius: 16,
      justifyContent: "flex-start",
    }}
  >
    <View
      style={{
        borderRightWidth: 1,
        borderColor: Colors.inputBorderColor,
        justifyContent: "center",
        width: 36,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: Colors.text200, textAlign: "center" }}>{id}</Text>
    </View>
    <View style={{ justifyContent: "center" }}>
      <Text>{title}</Text>
    </View>
  </Row>
);

export default function MnemonicWords({ mnemonic }: MnemonicWordsProps) {
  return (
    <View>
      <FlatList
        testID="mnemonic-list"
        data={mnemonic}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <MnemonicChip title={item} id={index + 1} />
        )}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
}
