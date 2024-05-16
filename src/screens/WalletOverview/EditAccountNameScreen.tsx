import { Paragraph, PrimaryButton, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { validateName } from "@/utils/validateInputs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

type EditAccountNameProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Edit name"
>;

export default function EditAccountNameScreen({
  navigation,
  route: {
    params: { account },
  },
}: EditAccountNameProps) {
  const name = useInputState();
  const [error, setError] = useState("");
  const { editAccountName, accounts } = useAccountsStore();

  useEffect(() => {
    name.onChangeText(account.name);
  }, []);

  useEffect(() => {
    setError("");
  }, [name.value]);

  const editName = () => {
    try {
      validateName(name.value, accounts);
      editAccountName(account.address, name.value);
      navigation.goBack();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <SafeLayout style={{ paddingTop: 24 }} noScroll={true}>
      <Paragraph style={{ marginBottom: 12 }}>
        Give your account name to easily identify it. Names are stored locally
        and can only be seen by you
      </Paragraph>
      <TextInput {...name} error={!!error} />
      <PrimaryButton
        style={{ marginTop: 32 }}
        title="Save account name"
        onPress={editName}
      />
      {error && <Paragraph style={{ color: Colors.danger }}>{error}</Paragraph>}
    </SafeLayout>
  );
}
