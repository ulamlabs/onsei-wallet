export function unique<T>(items: T[], keyFn: (item: T) => string | number) {
  const keys = new Set<string | number>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!keys.has(key)) {
      keys.add(key);
      result.push(item);
    }
  }
  return result;
}
