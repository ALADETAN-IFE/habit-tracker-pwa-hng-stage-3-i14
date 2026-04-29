import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../src/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    const today = '2026-04-28';
    expect(calculateCurrentStreak(['2026-04-27'], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const today = '2026-04-28';
    expect(calculateCurrentStreak(['2026-04-28', '2026-04-27', '2026-04-26'], today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const today = '2026-04-28';
    expect(calculateCurrentStreak(['2026-04-28', '2026-04-28', '2026-04-27'], today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const today = '2026-04-28';
    expect(calculateCurrentStreak(['2026-04-28', '2026-04-26'], today)).toBe(1);
  });
});
