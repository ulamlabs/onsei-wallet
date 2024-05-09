export function distributeItems(
  space: number,
  widths: number[],
  activeIndex: number,
): number[] {
  const activeWidth = widths[activeIndex];
  const spacePerInactive = (space - activeWidth) / (widths.length - 1);
  let currentPosition = 0;
  const positions: number[] = [];
  for (let i = 0; i < widths.length; i++) {
    let nextWidth: number;
    if (i === activeIndex) {
      nextWidth = widths[i];
    } else {
      nextWidth = spacePerInactive;
    }
    positions.push(currentPosition + nextWidth / 2);
    currentPosition += nextWidth;
  }
  return positions;
}
