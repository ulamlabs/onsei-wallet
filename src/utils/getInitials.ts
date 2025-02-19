export default function getInitials(value: string) {
  return value
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);
}
