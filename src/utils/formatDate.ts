export function formatDate(date: string) {
  // Convert string to Date object
  const dateObject = new Date(date);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Months are zero-indexed
  const year = dateObject.getFullYear();

  const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
  return formattedDate;
}
