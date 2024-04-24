import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import SafeLayout from "@/components/SafeLayout";
import tw from "@/lib/tailwind";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { useAccountsStore } from "@/store";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Text, TextInput, View } from "react-native";

type SendAssetsProps = NativeStackScreenProps<ConnectedStackParamList, "Send">;

export default ({ navigation }: SendAssetsProps) => {
  const { activeAccount, getBalance } = useAccountsStore();
  const { addressBook } = useContext(
    AddressBookContext
  ) as AddressBookContextType;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiverInput, setReceiverInput] = useState("");
  const [amountInput, setAmountInput] = useState("");

  async function onMax() {
    // amountInput.onChangeText!('Calculating...');
    // const balance = getBalance();
    // const fee = await estimateFee(balance);
    // amountInput.onChangeText!(
    //   D.max(new D(balance).minus(fee).minus(1e-12), 0).toString(),
    // );
    // HANDLE WHEN CONNECTED
  }

  async function onSend() {
    // setError(null);
    // if (!receiverInput.value || !amountInput.value) {
    //   setError('All inputs need to be filled');
    //   return;
    // }
    // if (receiverInput.value === activeAccount) {
    //   setError('You cannot send funds to your own address');
    //   return;
    // }
    // try {
    //   validateAddress(receiverInput.value);
    // } catch (e) {
    //   setError('Invalid receiver address');
    //   return;
    // }
    // const amount = Number(amountInput.value.replaceAll(',', '.'));
    // if (Number.isNaN(amount) || amount === 0) {
    //   setError('Invalid amount entered');
    //   return;
    // }
    // const fee = await estimateFee(amount);
    // if (amount > getBalance() - fee) {
    //   setError('Insufficient funds');
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const txnHash = await transferAsset(
    //     receiverInput.value,
    //     Number(amountInput.value),
    //   );
    //   console.log(`Submitted with hash ${txnHash}`);
    //   onAfterSubmit();
    //   setModalVisible(true);
    // } catch (e: any) {
    //   console.log('Error while submitting:', e);
    //   setError(e.message);
    // } finally {
    //   setLoading(false);
    // }
    // HANDLE SEND WHEN CONNECTED
  }

  function goBack() {
    setModalVisible(false);
    navigation.goBack();
  }

  return (
    <SafeLayout>
      <BackButton />
      <View style={tw`items-center`}>
        <Text style={tw`text-4xl font-black text-white mb-8 mt-12`}>
          SEND ASSETS
        </Text>

        <Text style={tw`text-white`}>Provide address of the receiver</Text>
        <TextInput
          style={tw`input w-full mt-2`}
          value={receiverInput}
          placeholder="Receiver address"
        />

        <Text style={tw`text-white mt-5`}>Amount to send</Text>
        <View style={tw`w-full items-center flex-row mt-2`}>
          <TextInput
            style={tw`input flex-6 mr-2`}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amountInput}
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
        description={`You successfully transfered ${amountInput} TZERO to ${receiverInput}`}
        buttonTxt="Back to Overview"
        onConfirm={goBack}
      />
    </SafeLayout>
  );
};
