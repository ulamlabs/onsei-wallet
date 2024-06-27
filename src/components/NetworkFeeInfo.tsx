import { useModalStore } from "@/store";
import { Colors, FontSizes } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import { TouchableOpacity } from "react-native";
import { Row } from "./layout";
import { Paragraph, Text } from "./typography";

export default function NetworkFeeInfo() {
  const { alert } = useModalStore();

  function showFeeInfo() {
    alert({
      title: "",
      description: (
        <Paragraph size="base" style={{ color: Colors.text }}>
          A network fee is a blockchain charge for processing and confirming
          transactions. Our wallet is free to use.
        </Paragraph>
      ),
      icon: InfoCircle,
      ok: "Got it",
    });
  }

  return (
    <TouchableOpacity onPress={showFeeInfo}>
      <Row style={{ gap: 8 }}>
        <Text style={{ fontSize: FontSizes.base }}>Network fee</Text>

        <InfoCircle size={16} color={Colors.text} />
      </Row>
    </TouchableOpacity>
  );
}
