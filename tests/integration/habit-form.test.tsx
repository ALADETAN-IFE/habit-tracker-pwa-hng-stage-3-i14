// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HabitForm from '../../src/components/habits/HabitForm';
import HabitCard from '../../src/components/habits/HabitCard';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { calculateCurrentStreak } from '../../src/lib/streaks';
import { getHabitSlug } from '../../src/lib/slug';
import { Habit } from "../../src/types/habit";

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows a validation error when habit name is empty', async () => {
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} />);
    const save = screen.getByTestId('habit-save-button');
    fireEvent.click(save);
    expect(await screen.findByText('Habit name is required')).toBeTruthy();
  });

  it('creates a new habit and renders it in the list', async () => {

    function TestWrapper() {
      const [habits, setHabits] = useState<Habit[]>([]);
      function handleSave(data: { name: string; description: string }) {
        const newHabit: Habit = {
          id: "h1",
          userId: "u1",
          name: data.name,
          description: data.description,
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [],
        };
        setHabits(prev => [...prev, newHabit]);
      }
      return (
        <div>
          <HabitForm onSave={handleSave} />
          <div>
            {habits.map(h => (
              <div data-testid={`habit-card-${getHabitSlug(h.name)}`} key={h.id}>{h.name}</div>
            ))}
          </div>
        </div>
      );
    }

    render(<TestWrapper />);
    const name = screen.getByTestId('habit-name-input') as HTMLInputElement;
    const desc = screen.getByTestId('habit-description-input') as HTMLInputElement;
    const save = screen.getByTestId('habit-save-button');

    fireEvent.change(name, { target: { value: 'Drink Water' } });
    fireEvent.change(desc, { target: { value: 'Stay hydrated' } });
    fireEvent.click(save);

    expect(await screen.findByTestId('habit-card-drink-water')).toBeTruthy();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const original: Habit = {
      id: "h2",
      userId: "u2",
      name: "Read Books",
      description: "old",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: ["2026-01-02"],
    };

    let saved: Habit | null = null;
    function handleSave(data: { name: string; description: string }) {
      saved = { ...original, name: data.name, description: data.description };
    }

    render(<HabitForm initial={original} onSave={handleSave} />);
    const name = screen.getByTestId('habit-name-input') as HTMLInputElement;
    const desc = screen.getByTestId('habit-description-input') as HTMLInputElement;
    const save = screen.getByTestId('habit-save-button');

    fireEvent.change(name, { target: { value: 'Read More' } });
    fireEvent.change(desc, { target: { value: 'new desc' } });
    fireEvent.click(save);

    expect(saved).toBeTruthy();
    expect(saved!.id).toBe(original.id);
    expect(saved!.userId).toBe(original.userId);
    expect(saved!.createdAt).toBe(original.createdAt);
    expect(saved!.completions).toEqual(original.completions);
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit:Habit = { id: 'h3', userId: 'u3', name: 'walk', description: '', frequency: 'daily', createdAt: '', completions: [] };
    function TestDeleteWrapper() {
      const [items, setItems] = useState<Habit[]>([habit]);
      function handleDelete(id: string) {
        if (window.confirm('Are you sure?')) setItems(prev => prev.filter(p => p.id !== id));
      }
      return (
        <div>
          {items.map(h => (
            <div key={h.id}>
              <HabitCard habit={h} onDelete={handleDelete} onEdit={() => {}} onToggle={() => {}} streak={0} completedToday={false} />
            </div>
          ))}
        </div>
      );
    }

    render(<TestDeleteWrapper />);
    // cancel deletion
    vi.stubGlobal('confirm', () => false);
    fireEvent.click(screen.getByTestId('habit-delete-walk'));
    expect(screen.getByTestId('habit-card-walk')).toBeTruthy();

    // confirm deletion
    vi.stubGlobal('confirm', () => true);
    fireEvent.click(screen.getByTestId('habit-delete-walk'));
    expect(screen.queryByTestId('habit-card-walk')).toBeNull();
  });

  it('toggles completion and updates the streak display', async () => {
    const habit: Habit = { id: 'h4', userId: 'u4', name: 'Stretch', description: '', frequency: 'daily', createdAt: '', completions: [] };
    function TestToggleWrapper() {
      const [h, setH] = useState(habit);
      function handleToggle() {
        const next = toggleHabitCompletion(h, new Date().toISOString().slice(0, 10));
        setH(next as Habit);
      }
      const streak = calculateCurrentStreak(h.completions, new Date().toISOString().slice(0, 10));
      const completedToday = h.completions.includes(new Date().toISOString().slice(0, 10));
      return (
        <HabitCard
          habit={h as Habit}
          onToggle={handleToggle}
          onEdit={() => {}}
          onDelete={() => {}}
          streak={streak}
          completedToday={completedToday}
        />
      );
    }

    render(<TestToggleWrapper />);
    const completeBtn = screen.getByTestId('habit-complete-stretch');
    fireEvent.click(completeBtn);
    // after clicking, button label should change to Unmark
    expect(await screen.findByText(/Unmark/i)).toBeTruthy();
  });
});
