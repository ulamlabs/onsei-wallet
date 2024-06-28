import { Colors, FontSizes, FontWeights } from "@/styles";
import { Pressable } from "react-native";
import { CloseIcon } from "../icons";
import { Row } from "../layout";
import { Text } from "../typography";

type Props = {
  title: string;
  onClose?: () => void;
};

export default function ModalHeadline({ title, onClose }: Props) {
  return (
    <Row
      style={{
        paddingHorizontal: 16,
        paddingVertical: 24,
        marginTop: -24,
        justifyContent: "flex-start",
        gap: 24,
        backgroundColor: Colors.background100,
        marginLeft: -16,
        marginRight: -16,
      }}
    >
      {onClose && (
        <Pressable onPress={onClose}>
          <CloseIcon size={13} />
        </Pressable>
      )}
      <Text style={{ fontFamily: FontWeights.bold, fontSize: FontSizes.lg }}>
        {title}
      </Text>
    </Row>
  );
}
