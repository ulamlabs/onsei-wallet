// Not encrypted storage for non-sensitive and frequently used data.
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * The key and value pair is permanently stored unless you remove it yourself.
 *
 * The key param should be unique and not have underscore ("_") in it.
 */
export async function saveToStorage(key: string, data: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export async function loadFromStorage(key: string, defaultValue: any = null) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (e) {
    // No data found in the storage
    return defaultValue;
  }
}

export async function removeFromStorage(key: string) {
  await AsyncStorage.removeItem(key);
}
