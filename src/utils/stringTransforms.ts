export function hexStringtoUint8(hexString: string) {
  if (hexString.length === 0) {
    return new Uint8Array();
  }
  return Uint8Array.from(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
}

export function uint8ToBase64(array: Uint8Array) {
  return Buffer.from(array).toString("base64");
}

export function hexStringToBase64(hexString: string) {
  return uint8ToBase64(hexStringtoUint8(hexString));
}
