import { maskName, truncate } from './string';

describe('maskName', () => {
  it('masks a name longer than 3 chars', () => {
    expect(maskName('Alice')).toBe('Ali***');
  });

  it('masks a name exactly 3 chars', () => {
    expect(maskName('Bob')).toBe('Bob***');
  });

  it('masks a name shorter than 3 chars', () => {
    expect(maskName('Bo')).toBe('Bo***');
  });

  it('masks a single-character name', () => {
    expect(maskName('X')).toBe('X***');
  });

  it('masks an empty string', () => {
    expect(maskName('')).toBe('***');
  });
});

describe('truncate', () => {
  it('truncates a string longer than maxLen', () => {
    expect(truncate('Hello World', 5)).toBe('Hello…');
  });

  it('returns the string unchanged when equal to maxLen', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('returns the string unchanged when shorter than maxLen', () => {
    expect(truncate('Hi', 5)).toBe('Hi');
  });

  it('handles maxLen of 0', () => {
    expect(truncate('Hello', 0)).toBe('…');
  });
});
