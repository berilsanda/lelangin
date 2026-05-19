import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats a whole number with IDR default locale', () => {
    const result = formatCurrency(150000);
    // Should contain the amount digits and IDR indicator
    expect(result).toContain('150');
    expect(result.toLowerCase()).toMatch(/rp|idr/i);
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats a large number', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('accepts a custom locale', () => {
    const result = formatCurrency(150000, 'en-US');
    // en-US with IDR currency uses "IDR" prefix
    expect(result).toMatch(/IDR/);
    expect(result).toContain('150');
  });

  it('returns a string', () => {
    expect(typeof formatCurrency(100)).toBe('string');
  });
});
