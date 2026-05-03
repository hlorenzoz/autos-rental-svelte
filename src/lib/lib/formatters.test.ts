import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    const result = formatCurrency(1000, 'en');
    expect(result).toContain('$1,000');
  });

  it('should format ARS correctly', () => {
    const result = formatCurrency(1000, 'es');
    expect(result).toContain('$');
    expect(result).toContain('1.000');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0, 'en');
    expect(result).toContain('$0');
  });
});
