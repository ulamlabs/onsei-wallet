export const chunkArray = (array: string[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize).join(","));
  }
  return chunks;
};
