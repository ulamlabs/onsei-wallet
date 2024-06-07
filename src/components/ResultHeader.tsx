import { Headline, Paragraph } from "@/components";
import { Colors } from "@/styles";
import { CloseCircle, TickCircle } from "iconsax-react-native";
import { View } from "react-native";

type Props = {
  success?: boolean;
  description?: string;
  header?: string;
};

export default function ResultHeader({
  success = true,
  description,
  header,
}: Props) {
  return (
    <>
      <View
        style={{
          padding: 20,
          width: 128,
          height: 128,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 22,
          backgroundColor: success ? Colors.success200 : Colors.danger200,
        }}
      >
        {success ? (
          <TickCircle variant="Bold" color={Colors.success} size={88} />
        ) : (
          <CloseCircle variant="Bold" color={Colors.danger} size={88} />
        )}
      </View>
      <Headline>
        {header || (success ? "It's Done!" : "Something went wrong")}
      </Headline>
      <Paragraph size="base" style={{ textAlign: "center" }}>
        {description ||
          (success
            ? "Transaction completed successfully."
            : "Click below to see why the transaction failed.")}
      </Paragraph>
    </>
  );
}
