import { formatRuntime, formatCurrency, ratingColor, posterUrl } from './utils';

describe('Utility Functions', () => {
  describe('formatRuntime', () => {
    it('formats minutes into hours and minutes', () => {
      expect(formatRuntime(135)).toBe('2h 15m');
      expect(formatRuntime(45)).toBe('45m');
      expect(formatRuntime(120)).toBe('2h 0m');
    });

    it('returns empty string for null or 0', () => {
      expect(formatRuntime(null)).toBe('');
      expect(formatRuntime(0)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers to USD currency standard', () => {
      expect(formatCurrency(1500000)).toBe('$1,500,000');
    });