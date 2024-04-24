import * as SecureStore from "expo-secure-store";

export function saveToSecureStorage(key: string, data: any) {
  try {
    SecureStore.setItem(key, JSON.stringify(data));
  } catch (e: any) {
    console.error(e);
    throw Error(e.message);
  }
}

export function loadFromSecureStorage(key: string, defaultValue: any = null) {
  try {
    const data = SecureStore.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (e) {
    // No data found in the storage
    return defaultValue;
  }
}

export function removeFromSecureStorage(key: string) {
  SecureStore.deleteItemAsync(key);
}
