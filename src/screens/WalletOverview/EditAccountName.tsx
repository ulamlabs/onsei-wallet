import { Paragraph, PrimaryButton, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

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

  useEffect(() => {
    name.onChangeText(account.name);
  }, []);

  const editName = () => {
    editAccountName(account.address, name.value);
    navigation.goBack();
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
    </SafeLayout>
  );
}
