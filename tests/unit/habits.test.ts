import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  const baseHabit: Habit = {
    id: '1',
    userId: 'u1',
    name: 'Read',
    description: '',
    frequency: 'daily',
    createdAt: '2026-04-28',
    completions: []
  };

  it('adds a completion date when the date is not present', () => {
    const updated = toggleHabitCompletion(baseHabit, '2026-04-28');
    expect(updated.completions).toContain('2026-04-28');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2026-04-28'] };
    const updated = toggleHabitCompletion(habit, '2026-04-28');
    expect(updated.completions).not.toContain('2026-04-28');
  });

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: ['2026-04-28'] };
    const copy = { ...habit, completions: [...habit.completions] };
    toggleHabitCompletion(habit, '2026-04-27');
    expect(habit).toEqual(copy);
  });

  it('does not return duplicate completion dates', () => {
    const habit = { ...baseHabit, completions: ['2026-04-28'] };
    const updated = toggleHabitCompletion(habit, '2026-04-28');
    expect(new Set(updated.completions).size).toBe(updated.completions.length);
  });
});
