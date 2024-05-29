export function trimAddress(
  address: string,
  options = { prefixCut: 5, suffixCut: 5 },
) {
  if (!address) {
    return "";
  }
  return (
    address.slice(0, options.prefixCut) +
    "...." +
    address.slice(-options.suffixCut)
  );
}
