/**
 * Masks a name for anonymization by showing the first 3 characters followed by `***`.
 * Names shorter than 3 characters are shown in full followed by `***`.
 *
 * @example maskName("Alice") → "Ali***"
 * @example maskName("Bo")    → "Bo***"
 */
export function maskName(name: string): string {
  return `${name.slice(0, 3)}***`;
}

/**
 * Truncates a string to `maxLen` characters, appending `…` if truncated.
 *
 * @example truncate("Hello World", 5) → "Hello…"
 * @example truncate("Hi", 5)          → "Hi"
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}…`;
}
