export const roundToDecimal = (n?: number, decimal = 1) =>
  !!n ? Math.round(n * (10 * decimal)) / (10 * decimal) : 0;
