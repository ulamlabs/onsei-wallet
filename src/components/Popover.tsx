import { PropsWithChildren } from "react";
import { View } from "react-native";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
};

export default ({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
}: Props) => {
  return (
    <View>
      {toggleElement}
      {/* <Modal
        style={tw`bg-background`}
        animationType="slide"
        transparent={true}
        visible={isVisible}
        supportedOrientations={["landscape", "portrait"]}
      >
        <TouchableOpacity onPress={onBackdropPress}>
          {children}
        </TouchableOpacity>
      </Modal> */}
      {/* add popover when got ui library */}
    </View>
  );
};
