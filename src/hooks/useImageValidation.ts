import isValidImage from "@/utils/isValidImage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useImageValidation(
  src: string | null,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    const checkImage = async () => {
      try {
        if (!src) {
          setIsImageValid(false);
          return;
        }
        const isValid = await isValidImage(src);
        setIsImageValid(isValid);
      } catch (error) {
        console.error("Error validating image:", error);
        setIsImageValid(false);
      }
    };

    checkImage();
  }, [src]);

  return [isImageValid, setIsImageValid];
}
