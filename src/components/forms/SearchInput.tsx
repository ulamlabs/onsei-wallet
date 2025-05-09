import { SearchNormal1 } from "iconsax-react-native";
import TextInput from "./TextInput";
import { StyleProp, ViewStyle } from "react-native";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  containerStyle,
}: SearchInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      icon={SearchNormal1}
      showClear={true}
      containerStyle={containerStyle}
    />
  );
}
