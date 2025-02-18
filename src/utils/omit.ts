export default function omit(obj: any, key: string) {
  const { [key]: _, ...rest } = obj;
  return rest;
}
