import { formatPrice, formatPriceRange, toCents, fromCents } from '../src/lib/format';

describe('format utilities', () => {
  describe('formatPrice', () => {
    it('formats decimal string prices correctly', () => {
      expect(formatPrice('18.50')).toBe('$18.50');
      expect(formatPrice('1200.00')).toBe('$1,200.00');
      expect(formatPrice('0.99')).toBe('$0.99');
    });

    it('formats numbers correctly', () => {
      expect(formatPrice(25.5)).toBe('$25.50');
    });

    it('handles null, undefined, and empty string gracefully', () => {
      expect(formatPrice(null)).toBe('—');
      expect(formatPrice(undefined)).toBe('—');
      expect(formatPrice('')).toBe('—');
    });
  });

  describe('formatPriceRange', () => {
    it('formats distinct min and max price ranges', () => {
      expect(formatPriceRange('15.00', '35.00')).toBe('$15.00 – $35.00');
    });

    it('returns single price when min equals max', () => {
      expect(formatPriceRange('29.99', '29.99')).toBe('$29.99');
    });

    it('handles only min or only max price', () => {
      expect(formatPriceRange('19.99', null)).toBe('$19.99');
      expect(formatPriceRange(null, '49.99')).toBe('$49.99');
    });

    it('returns fallback when neither is provided', () => {
      expect(formatPriceRange(null, null)).toBe('Price on request');
    });
  });

  describe('toCents & fromCents', () => {
    it('converts decimal strings to cents avoiding float precision errors', () => {
      expect(toCents('19.99')).toBe(1999);
      expect(toCents('0.05')).toBe(5);
      expect(toCents('100')).toBe(10000);
      expect(toCents('10.5')).toBe(1050);
    });

    it('converts cents back to decimal strings accurately', () => {
      expect(fromCents(1999)).toBe('19.99');
      expect(fromCents(5)).toBe('0.05');
      expect(fromCents(10000)).toBe('100.00');
      expect(fromCents(0)).toBe('0.00');
    });

    it('calculates line item totals with exact precision', () => {
      // 3 items at $19.99 = $59.97 (not 59.970000000000006)
      const cents = toCents('19.99') * 3;
      expect(fromCents(cents)).toBe('59.97');
    });
  });
});
