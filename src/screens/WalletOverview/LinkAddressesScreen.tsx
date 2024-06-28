import { LinkAddresses, SafeLayout } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type LinkAddressesProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Link Addresses"
>;

export default function LinkAddressesScreen({
  route: {
    params: { address },
  },
}: LinkAddressesProps) {
  return (
    <SafeLayout
      style={{
        justifyContent: "space-between",
        maxHeight: "100%",
        paddingTop: 24,
      }}
      staticView={true}
    >
      <LinkAddresses address={address} />
    </SafeLayout>
  );
}
