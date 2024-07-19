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
          transactions. Onsei Wallet is free to use.
        </Paragraph>
      ),
      icon: InfoCircle,
      ok: "Got it",
      iconStyle: { transform: [{ rotate: "180deg" }] },
    });
  }

  return (
    <TouchableOpacity onPress={showFeeInfo}>
      <Row style={{ gap: 8 }}>
        <Text style={{ fontSize: FontSizes.base, color: Colors.text100 }}>
          Network fee
        </Text>

        <InfoCircle
          size={18}
          color={Colors.text100}
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </Row>
    </TouchableOpacity>
  );
}
