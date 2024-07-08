import { Headline, Paragraph } from "./typography";
import { Image } from "react-native";

type Header = "Success" | "Biometrics" | "Fail" | "Clear";

type Props = {
  type: Header;
  description: string;
  header: string;
};

const successSrc = require("../../assets/icon-success.png");
const clearSrc = require("../../assets/icon-clear.png");
const failSrc = require("../../assets/icon-fail.png");
const biometricsSrc = require("../../assets/icon-biometrics.png");
const ICON_SIZE = 150;
const iconStyle = { width: ICON_SIZE, height: ICON_SIZE };

export default function ResultHeader({ type, description, header }: Props) {
  const icon: Record<Header, React.JSX.Element> = {
    Success: <Image source={successSrc} style={iconStyle} />,
    Biometrics: <Image source={biometricsSrc} style={iconStyle} />,
    Fail: <Image source={failSrc} style={iconStyle} />,
    Clear: <Image source={clearSrc} style={iconStyle} />,
  };

  return (
    <>
      {icon[type]}

      <Headline>{header}</Headline>
      <Paragraph size="base" style={{ textAlign: "center" }}>
        {description}
      </Paragraph>
    </>
  );
}
