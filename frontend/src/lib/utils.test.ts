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

    it('returns an em dash for 0 amount', () => {
      expect(formatCurrency(0)).toBe('—');
    });
  });

  describe('ratingColor', () => {
    it('returns the correct color class based on rating', () => {
      expect(ratingColor(8.5)).toBe('text-emerald-400');
      expect(ratingColor(6.5)).toBe('text-amber-300');
      expect(ratingColor(5.0)).toBe('text-orange-400');
      expect(ratingColor(2.0)).toBe('text-red-400');
    });
  });

  describe('posterUrl', () => {
    it('constructs a TMDB image url correctly', () => {
      expect(posterUrl('/test.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/test.jpg');
    });

    it('returns the path directly if it is an external http link', () => {
      expect(posterUrl('https://example.com/test.jpg')).toBe('https://example.com/test.jpg');
    });

    it('returns placeholder if path is null', () => {
      expect(posterUrl(null)).toBe('/placeholder-poster.svg');
    });
  });
});
