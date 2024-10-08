import { linkAddresses } from "@/services/evm/tx";
import { useAccountsStore, useModalStore, useToastStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { ExportSquare } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import CopyAddressItem from "./CopyAddressItem";
import { PrimaryButton, TertiaryButton } from "./buttons";
import { Column } from "./layout";
import { Headline, Paragraph } from "./typography";

type LinkAddressesProps = { address: string };

export default function LinkAddresses({ address }: LinkAddressesProps) {
  const navigation = useNavigation<NavigationProp>();
  const { accounts, getMnemonic, setLinkForAddress } = useAccountsStore();
  const account = accounts.find((account) => account.address === address)!;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { modals, alert } = useModalStore();
  const { success } = useToastStore();

  // TODO: to delete when evm available
  useEffect(() => {
    async function comingSoonInfo() {
      await alert({
        description:
          "EVM is currently unavailable. Stay tuned for updates as we prepare for its upcoming launch!",
        title: "EVM Coming Soon!",
      });

      navigation.goBack();
    }
    comingSoonInfo();
  }, [alert]);

  async function onLink() {
    setLoading(true);
    setError("");

    const err = await linkAddresses(getMnemonic(address));
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }

    setLinkForAddress(address);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      modals[0].resolve(true);
    }
    success({ description: "Addresses linked successfully!" });
  }

  function onShowMore() {
    Linking.openURL("https://blog.sei.io/sei-v2-the-first-parallelized-evm/");
  }

  return (
    <>
      <View>
        <Headline>Link Sei & EVM addresses to explore Sei V2</Headline>
        <Paragraph style={{ textAlign: "center" }}>
          Linking your Sei address with its corresponding EVM (0x) address
          enables using Sei V2. This is free, but your wallet must have at least
          1 usei {"(< 0.01$)"}
        </Paragraph>

        <Column style={{ marginTop: 32 }}>
          <CopyAddressItem address={account.evmAddress} type="EVM" />
          <CopyAddressItem address={account.address} type="SEI" />
        </Column>
      </View>

      <View style={{ gap: 12, marginBottom: 0, paddingTop: 24 }}>
        {error && (
          <Paragraph style={{ color: Colors.danger, textAlign: "center" }}>
            {error}
          </Paragraph>
        )}
        <PrimaryButton
          title="Link addresses"
          loading={loading}
          onPress={onLink}
          disabled // Todo: to delete
        />
        <TertiaryButton
          disabled //Todo: to delete
          onPress={onShowMore}
          textStyle={{
            fontFamily: FontWeights.bold,
          }}
          iconSize={16}
          title="Learn more"
          icon={ExportSquare}
        />
      </View>
    </>
  );
}
