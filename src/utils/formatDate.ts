export function formatDate(date: string) {
  // Convert string to Date object
  const dateObject = new Date(date);

  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed
  const year = dateObject.getUTCFullYear();

  const formattedDate = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes} ${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
  return formattedDate;
}
