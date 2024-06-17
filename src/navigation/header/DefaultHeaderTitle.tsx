import { Row, Text } from "@/components";
import { FontSizes, FontWeights } from "@/styles";

export default function DefaultHeaderTitle({ title }: { title: string }) {
  return (
    <Row style={{ minWidth: "100%" }}>
      <Text style={{ fontSize: FontSizes.lg, fontFamily: FontWeights.bold }}>
        {title}
      </Text>
    </Row>
  );
}
