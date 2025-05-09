export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function isValidHttpUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    const supportedProtocols = ["http:", "https:"];
    return supportedProtocols.includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
}
