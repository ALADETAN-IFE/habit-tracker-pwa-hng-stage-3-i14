export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};

export type HabitFormProps = {
  initial?: Partial<Habit>;
  onSave: (data: { name: string; description: string }) => void;
  onCancel?: () => void;
};

export type HabitListProps = {
  habits: Habit[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  streaks: Record<string, number>;
  completedToday: Record<string, boolean>;
};

export type HabitCardProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  streak: number;
  completedToday: boolean;
};
