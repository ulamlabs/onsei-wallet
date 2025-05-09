export default function formatIpfsToHttpUrl(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    const ipfsHash = uri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  return uri;
}
