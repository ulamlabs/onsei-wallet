import tw from "@/lib/tailwind";
import { View } from "react-native";

type Props = {
  styles?: string;
};

export default ({ styles }: Props) => {
  return <View style={tw`w-full h-[1px] bg-basic-600 ${styles || ""}`} />;
};
