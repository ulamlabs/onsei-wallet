import { Modal } from "@/components";
import Button from "@/components/Button";
import SafeLayout from "@/components/SafeLayout";
import { useInputState } from "@/hooks";
import tw from "@/lib/tailwind";
import { useAccountsStore } from "@/store";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Text, TextInput, View } from "react-native";

type SendAssetsProps = NativeStackScreenProps<NavigatorParamsList, "Send">;

export default ({ navigation }: SendAssetsProps) => {
  const { activeAccount } = useAccountsStore();
  const { addressBook } = useContext(
    AddressBookContext
  ) as AddressBookContextType;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const amountInput = useInputState();
  const receiverInput = useInputState();

  async function onMax() {
    // TODO: handle max am ount
  }

  async function onSend() {
    // TODO: handle send
  }

  function goBack() {
    setModalVisible(false);
    navigation.goBack();
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>SEND ASSETS</Text>

        <Text style={tw`text-white`}>Provide address of the receiver</Text>
        <TextInput
          style={tw`input w-full mt-2`}
          placeholder="Receiver address"
          {...receiverInput}
        />

        <Text style={tw`text-white mt-5`}>Amount to send</Text>
        <View style={tw`w-full items-center flex-row mt-2`}>
          <TextInput
            style={tw`input flex-6 mr-2`}
            placeholder="Amount"
            keyboardType="decimal-pad"
            {...amountInput}
          />
          <Button label="MAX" onPress={onMax} />
        </View>

        <Button
          label="Sign and Send"
          isLoading={loading}
          styles={tw`mt-8 mb-3`}
          onPress={onSend}
        />
        {error && <Text style={tw`text-danger-600`}>{error}</Text>}
      </View>

      <Modal
        isVisible={modalVisible}
        title="Transfer successful!"
        description={`You successfully transfered ${amountInput} SEI to ${receiverInput}`}
        buttonTxt="Back to Overview"
        onConfirm={goBack}
      />
    </SafeLayout>
  );
};
