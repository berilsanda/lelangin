/**
 * Formats a number as a currency string.
 * Defaults to Indonesian Rupiah (`id-ID` locale, `IDR` currency).
 *
 * @example formatCurrency(150000)          → "Rp 150.000"
 * @example formatCurrency(150000, "en-US") → "IDR 150,000.00"
 */
export function formatCurrency(amount: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}
