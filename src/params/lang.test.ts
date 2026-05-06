import { describe, it, expect } from 'vitest';
import { match } from './lang';

describe('lang param matcher', () => {
  it('matches valid locales', () => {
    expect(match('en')).toBe(true);
    expect(match('es')).toBe(true);
  });

  it('does not match invalid locales', () => {
    expect(match('fr')).toBe(false);
    expect(match('de')).toBe(false);
    expect(match('123')).toBe(false);
    expect(match('')).toBe(false);
  });
});
