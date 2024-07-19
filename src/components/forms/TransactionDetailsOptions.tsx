import { Colors, FontWeights } from "@/styles";
import Option, { OptionProps } from "./Option";

export default function TransactionDetailsOption(props: OptionProps) {
  return (
    <Option
      labelStyle={{
        fontFamily: FontWeights.regular,
        color: Colors.text100,
      }}
      {...props}
    >
      {props.children}
    </Option>
  );
}
