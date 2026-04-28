import { useState } from "react";
import { HabitFormProps } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";


export default function HabitForm({ initial = {}, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Habit name is required");
      return;
    }
    if (name.length > 60) {
      setError("Habit name must be 60 characters or fewer");
      return;
    }
    setError(null);
    const slugName = getHabitSlug(name)
    onSave({ name: slugName, description });
  }

  return (
    <form className="card" data-testid="habit-form" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="habit-name">Name</label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          className="w-full border rounded p-2 mt-1"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={60}
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="habit-description">Description</label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          className="w-full border rounded p-2 mt-1"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="habit-frequency">Frequency</label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          className="w-full border rounded p-2 mt-1 cursor-not-allowed bg-gray-100"
          value="daily"
          disabled
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="btn-primary" data-testid="habit-save-button">Save</button>
        {onCancel && <button type="button" className="btn-accent" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}