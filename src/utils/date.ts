import { formatDistanceToNow, format, isPast } from 'date-fns';

/**
 * Returns a human-readable relative time string (e.g. "3 minutes ago").
 * Uses `date-fns/formatDistanceToNow` with `addSuffix: true`.
 */
export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Returns a formatted date-time string in the pattern `dd MMM yyyy, HH:mm`.
 * Example: "25 Dec 2024, 14:30"
 */
export function formatDateTime(date: Date): string {
  return format(date, 'dd MMM yyyy, HH:mm');
}

/**
 * Returns `true` if the given date is in the past.
 */
export function isExpired(date: Date): boolean {
  return isPast(date);
}
