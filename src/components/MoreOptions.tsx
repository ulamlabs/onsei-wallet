import { useRef, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Dropdown, DropdownOption } from "./Dropdown";
import { More } from "iconsax-react-native";
import { Colors } from "@/styles";

type MoreOptionsProps<T> = {
  options: DropdownOption<T>[];
  icon: React.ReactNode;
};

export default function MoreOptions<T>({ options, icon }: MoreOptionsProps<T>) {
  const moreOptionsButtonRef = useRef<TouchableOpacity>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleMoreOptionsPress = () => {
    setShowMoreOptions((prev) => !prev);
  };

  const handleMoreOptionsSelect = (value: T) => {
    const selectedOption = options?.find((option) => option.value === value);
    selectedOption?.onPress?.();
    setShowMoreOptions(false);
  };
  const hasMoreOptions = !!options?.length;

  return (
    <View>
      {hasMoreOptions && (
        <Pressable onPress={handleMoreOptionsPress} ref={moreOptionsButtonRef}>
          {icon ?? <More color={Colors.text} size={28} />}
        </Pressable>
      )}
      {hasMoreOptions && (
        <Dropdown
          visible={showMoreOptions}
          options={options}
          buttonRef={moreOptionsButtonRef}
          onClose={() => setShowMoreOptions(false)}
          onSelect={handleMoreOptionsSelect}
        />
      )}
    </View>
  );
}
