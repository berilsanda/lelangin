import { renderHook, act } from '@testing-library/react-native';

import { useCountdown } from '../use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "01:00:00" when end date is exactly 1 hour in the future', () => {
    const endAt = new Date(Date.now() + 60 * 60 * 1_000);
    const { result } = renderHook(() => useCountdown(endAt));
    expect(result.current).toBe('01:00:00');
  });

  it('decrements to "00:59:59" after 1000ms', () => {
    const endAt = new Date(Date.now() + 60 * 60 * 1_000);
    const { result } = renderHook(() => useCountdown(endAt));

    act(() => {
      jest.advanceTimersByTime(1_000);
    });

    expect(result.current).toBe('00:59:59');
  });

  it('returns "00:00:00" when end date is in the past', () => {
    const endAt = new Date(Date.now() - 1_000);
    const { result } = renderHook(() => useCountdown(endAt));
    expect(result.current).toBe('00:00:00');
  });

  it('calls clearInterval on unmount (no memory leak)', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const endAt = new Date(Date.now() + 60 * 60 * 1_000);
    const { unmount } = renderHook(() => useCountdown(endAt));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
