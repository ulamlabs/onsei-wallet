export function getNumberName(number: number) {
  return {
    1: { counter: "1st", name: "first" },
    2: { counter: "2nd", name: "second" },
    3: { counter: "3rd", name: "third" },
    4: { counter: "4th", name: "fourth" },
    5: { counter: "5th", name: "fifth" },
    6: { counter: "6th", name: "sixth" },
    7: { counter: "7th", name: "seventh" },
    8: { counter: "8th", name: "eighth" },
    9: { counter: "9th", name: "ninth" },
    10: { counter: "10th", name: "tenth" },
    11: { counter: "11th", name: "eleventh" },
    12: { counter: "12th", name: "twelfth" },
  }[number]!;
}
