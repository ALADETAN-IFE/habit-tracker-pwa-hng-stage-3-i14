import { HabitCardProps } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { CheckCircle, Undo2, Pencil, Trash2, Flame } from "lucide-react";

export default function HabitCard({ habit, onToggle, onEdit, onDelete, streak, completedToday }: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  return (
    <div className="card" data-testid={`habit-card-${slug}`}> 
      <div className="flex items-center justify-between mb-2">
        <h3>{habit.name}</h3>
        <span data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-1 text-orange-500 font-semibold"
        >
          <Flame size={18} /> {streak}
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-600">{habit.description}</p>
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn-primary ${completedToday ? "opacity-70" : ""} gap-1`}
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
        >
          {completedToday ? <Undo2 size={16} /> : <CheckCircle size={16} />}
          {completedToday ? "Unmark" : "Complete"}
        </button>
        <button className="btn-accent flex items-center gap-1 btn-sm" data-testid={`habit-edit-${slug}`} onClick={() => onEdit(habit.id)}>
          <Pencil size={16} /> Edit
        </button>
        <button className="btn-accent flex items-center gap-1 btn-sm" data-testid={`habit-delete-${slug}`} onClick={() => onDelete(habit.id)}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}