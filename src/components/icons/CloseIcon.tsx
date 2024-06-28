import { Colors } from "@/styles";
import { Path, Svg } from "react-native-svg";

type IconProps = {
  color?: string;
  size?: number;
};

export default function CloseIcon({ color, size }: IconProps) {
  return (
    <Svg width={size || 12} height={size || 12} viewBox="0 0 14 14" fill="none">
      <Path
        d="M0.999512 1L12.9995 13"
        stroke={color || Colors.text}
        strokeWidth="1.28571"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M0.998047 13L12.998 1"
        stroke={color || Colors.text}
        strokeWidth="1.28571"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
