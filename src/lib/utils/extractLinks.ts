export function extractLinks(text: string) {
  const urlPattern = /https?:\/\/[^\s]+/g; // Regular expression to match URLs

  const links = text.match(urlPattern);

  return links || [];
}
