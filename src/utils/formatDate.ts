export function formatDate(date: string | Date) {
  // Convert string to Date object
  if (typeof date === "string") {
    date = new Date(date);
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();

  const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
  return formattedDate;
}
