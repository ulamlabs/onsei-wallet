import { Buffer } from "@craftzdog/react-native-buffer";
import encoding from "text-encoding";

(process as any).version = "10.0.0";

(global as any).Buffer = Buffer;

global.TextEncoder = encoding.TextEncoder;
