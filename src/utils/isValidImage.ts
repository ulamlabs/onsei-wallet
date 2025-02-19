import { Image } from "react-native";
import { isValidHttpUrl } from "./isValidUrl";

export default async function isValidImage(src: string): Promise<boolean> {
  try {
    const validSrc = isValidHttpUrl(src);
    if (!validSrc) {
      return false;
    }

    await Image.prefetch(src);
    return true;
  } catch (error) {
    return false;
  }
}
