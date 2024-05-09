import { Paragraph, PrimaryButton, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

type EditAccountNameProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Edit name"
>;

export default function EditAccountName({
  navigation,
  route: {
    params: { account },
  },
}: EditAccountNameProps) {
  const name = useInputState();
  const { editAccountName } = useAccountsStore();
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    name.onChangeText(account.name);
  }, []);

  const editName = () => {
    editAccountName(account.address, name.value);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 1000);
    });
  };

  return (
    <SafeLayout style={{ paddingTop: 24 }} noScroll={true}>
      <Paragraph style={{ marginBottom: 12 }}>
        Give your account name to easily identify it. Names are stored locally
        and can only be seen by you
      </Paragraph>
      <TextInput {...name} />
      <PrimaryButton
        style={{ marginTop: 32 }}
        title="Save"
        onPress={editName}
      />
      <Animated.View style={{ opacity: opacityAnim }}>
        <Paragraph style={{ textAlign: "center" }}>
          Successfully changed name
        </Paragraph>
      </Animated.View>
    </SafeLayout>
  );
}
