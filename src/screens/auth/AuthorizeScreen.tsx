import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ProtectedAction from "./ProtectedAction";

type DisablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Authorize"
>;

export default function AuthorizeScreen({
  route,
  navigation,
}: DisablePinScreenProps) {
  function authorize() {
    navigation.goBack(); // Remove this view from history
    navigation.navigate(route.params.nextRoute, route.params.nextParams);
  }

  return <ProtectedAction action={authorize} />;
}
