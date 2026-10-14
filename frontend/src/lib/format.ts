/**
 * Price and string formatting utilities for Jackson storefront.
 * Handles decimal string prices from backend without float imprecision.
 */

export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === '') {
    return '—';
  }
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPriceRange(
  minPrice: string | null | undefined,
  maxPrice: string | null | undefined,
): string {
  if (!minPrice && !maxPrice) return 'Price on request';
  if (minPrice && (!maxPrice || minPrice === maxPrice)) {
    return formatPrice(minPrice);
  }
  if (minPrice && maxPrice) {
    return `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
  }
  return formatPrice(maxPrice);
}

/**
 * Convert decimal string like "19.99" to integer cents (1999) to avoid IEEE 754 precision issues.
 */
export function toCents(decimalStr: string | number): number {
  if (typeof decimalStr === 'number') {
    return Math.round(decimalStr * 100);
  }
  const clean = decimalStr.trim();
  const parts = clean.split('.');
  const dollars = parseInt(parts[0], 10) || 0;
  let cents = 0;
  if (parts.length > 1) {
    const frac = (parts[1] + '00').slice(0, 2);
    cents = parseInt(frac, 10) || 0;
  }
  return dollars * 100 + cents;
}

/**
 * Convert integer cents to decimal string "19.99".
 */
export function fromCents(cents: number): string {
  const isNegative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const frac = remainder.toString().padStart(2, '0');
  return `${isNegative ? '-' : ''}${dollars}.${frac}`;
}
