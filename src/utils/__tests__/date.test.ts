import { formatRelative, formatDateTime, isExpired } from '../date';

describe('date utilities', () => {
  const NOW = new Date('2024-06-15T12:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatRelative', () => {
    it('returns "2 minutes ago" for a date 2 minutes in the past', () => {
      const twoMinutesAgo = new Date(NOW.getTime() - 2 * 60 * 1000);
      expect(formatRelative(twoMinutesAgo)).toBe('2 minutes ago');
    });

    it('returns "3 days ago" for a date 3 days in the past', () => {
      const threeDaysAgo = new Date(NOW.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelative(threeDaysAgo)).toBe('3 days ago');
    });
  });

  describe('formatDateTime', () => {
    it('formats a date in dd MMM yyyy, HH:mm pattern', () => {
      const date = new Date('2024-12-25T14:30:00.000Z');
      const result = formatDateTime(date);
      // Pattern: dd MMM yyyy, HH:mm — exact value depends on local timezone
      expect(result).toMatch(/^\d{2} [A-Za-z]{3} \d{4}, \d{2}:\d{2}$/);
    });

    it('formats the pinned NOW date correctly', () => {
      const result = formatDateTime(NOW);
      expect(result).toMatch(/^\d{2} [A-Za-z]{3} 2024, \d{2}:\d{2}$/);
    });
  });

  describe('isExpired', () => {
    it('returns true for a date in the past', () => {
      const pastDate = new Date(NOW.getTime() - 1000);
      expect(isExpired(pastDate)).toBe(true);
    });

    it('returns false for a date in the future', () => {
      const futureDate = new Date(NOW.getTime() + 1000);
      expect(isExpired(futureDate)).toBe(false);
    });
  });
});
