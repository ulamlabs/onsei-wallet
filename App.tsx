import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import MainScreenNavigation from "@/navigation/MainScreenNavigation";
import AccountProvider from "@/store/account";
import AddressBookProvider from "@/store/addressBook";

export default function App() {
  useDeviceContext(tw);

  return (
    <SafeAreaProvider>
      <AccountProvider>
        <AddressBookProvider>
          <MainScreenNavigation />
        </AddressBookProvider>
      </AccountProvider>
    </SafeAreaProvider>
  );
}
