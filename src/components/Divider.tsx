import tw from "@/lib/tailwind";
import { View } from "react-native";

type Props = {
  styles?: string;
};

export default function Divider({ styles }: Props) {
  return <View style={tw.style("w-full h-[1px] bg-basic-600", styles)} />;
}
