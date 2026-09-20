/**
 * Format numeric currency amount using Intl.NumberFormat
 */
export function formatCurrency(amount: number, currency = "PKR"): string {
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if specific locale/currency combination fails
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}
