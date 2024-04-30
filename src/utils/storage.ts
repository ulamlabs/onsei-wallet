// Not encrypted storage for non-sensitive and frequently used data.
import Storage from "expo-storage";

/**
 * The key and value pair is permanently stored unless you remove it yourself.
 *
 * The key param should be unique and not have underscore ("_") in it.
 */
export async function saveToStorage(key: string, data: any) {
  try {
    await Storage.setItem({ key, value: JSON.stringify(data) });
  } catch (e: any) {
    console.error(e);
    throw Error(e.message);
  }
}

export async function loadFromStorage<T>(
  key: string,
  defaultValue: T,
): Promise<T> {
  try {
    const data = await Storage.getItem({ key });
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (e) {
    // No data found in the storage
    return defaultValue;
  }
}

export async function removeFromStorage(key: string) {
  await Storage.removeItem({ key });
}
