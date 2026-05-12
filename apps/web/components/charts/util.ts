// TODO: instantiate and return function
export const getCurrencyFormatter = (
  value: number,
  style: "currency" | "decimal" = "currency",
  decimalPlaces: number = 2
) => {
  const options = {
    currency: "USD",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    style,
  }
  return Intl.NumberFormat("en-US", options).format(value)
}
