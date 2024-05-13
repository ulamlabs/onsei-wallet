function cutTrailingZeros(amount: string) {
  const cutAmount = amount.replace(/\.?0+$/, "");
  if (cutAmount.includes(".")) {
    return cutAmount;
  }
  return `${cutAmount}.00`;
}

export function formatTokenAmount(value: string | number) {
  const amount = Number(value);
  if (amount <= 0 || isNaN(amount)) {
    return "0.00";
  } else if (Math.abs(amount) >= 0.01) {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  } else {
    let maxDigits;
    const whole = Math.floor(amount);
    const fraction =
      amount >= 1 ? "" : (amount - whole).toString().substring(2);
    if (!fraction) {
      maxDigits = 2;
    } else {
      const firstSignificant =
        fraction.split("").findIndex((v) => v !== "0") + 1;
      maxDigits = 2 * Math.round(firstSignificant / 2); // round to the nearest even number
    }

    return cutTrailingZeros(
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDigits,
      }),
    );
  }
}
