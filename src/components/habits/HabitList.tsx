import { HabitListProps } from "@/types/habit";
import HabitCard from "./HabitCard";


export default function HabitList({ habits, onToggle, onEdit, onDelete, streaks, completedToday }: HabitListProps) {
  return (
    <div>
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          streak={streaks[habit.id] || 0}
          completedToday={completedToday[habit.id] || false}
        />
      ))}
    </div>
  );
}