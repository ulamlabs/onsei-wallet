export default function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count === 0 || count > 1 ? "s" : ""}`;
}
