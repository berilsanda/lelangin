import { useEffect, useState } from 'react';

/**
 * Returns a live `HH:MM:SS` countdown string that ticks every second.
 * Returns `'00:00:00'` once the target date has passed.
 * Clears the interval on unmount.
 */
export function useCountdown(endAt: Date): string {
  const [timeLeft, setTimeLeft] = useState(() => formatRemaining(endAt));

  useEffect(() => {
    const tick = () => {
      setTimeLeft(formatRemaining(endAt));
    };

    const interval = setInterval(tick, 1_000);
    return () => {
      clearInterval(interval);
    };
  }, [endAt]);

  return timeLeft;
}

function formatRemaining(endAt: Date): string {
  const diff = endAt.getTime() - Date.now();
  if (diff <= 0) return '00:00:00';

  const totalSeconds = Math.floor(diff / 1_000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
