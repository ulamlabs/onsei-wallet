import { useAuthStore } from "@/store";
import ProtectedAction from "./ProtectedAction";

export default function UnlockScreen() {
  const authStore = useAuthStore();

  function unlock() {
    authStore.resetFails();
    authStore.unlock();
  }

  return <ProtectedAction action={unlock} />;
}
