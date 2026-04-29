"use client";

import { useState } from "react";
import { clearSession, getHabits, saveHabits } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import Modal from "@/components/ui/Modal";
import { Habit } from "@/types/habit";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const user = getCurrentUser();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>(
    user ? getHabits().filter((h: Habit) => h.userId === user.id) : [],
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);

  if (!user) return null;

  // Streaks and completion state
  const streaks: Record<string, number> = {};
  const completedToday: Record<string, boolean> = {};
  for (const habit of habits) {
    streaks[habit.id] = calculateCurrentStreak(habit.completions, todayISO());
    completedToday[habit.id] = habit.completions.includes(todayISO());
  }

  function handleToggle(id: string) {
    setHabits((hs) => {
      const updated = hs.map((h) =>
        h.id === id ? toggleHabitCompletion(h, todayISO()) : h,
      );
      saveHabits([
        ...getHabits().filter((h) => h.userId !== user?.id),
        ...updated,
      ]);
      return updated;
    });
  }

  function handleEdit(id: string) {
    setEditing(id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setHabits((hs) => {
      const updated = hs.filter((h) => h.id !== deleteId);
      saveHabits([
        ...getHabits().filter((h) => h.userId !== user?.id),
        ...updated,
      ]);
      return updated;
    });
    setDeleteId(null);
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  function handleSaveHabit(data: { name: string; description: string }) {
    if (!user?.id) return;
    if (editing) {
      setHabits((hs) => {
        const updated = hs.map((h) =>
          h.id === editing
            ? { ...h, name: data.name, description: data.description }
            : h,
        );
        saveHabits([
          ...getHabits().filter((h) => h.userId !== user?.id),
          ...updated,
        ]);
        return updated;
      });
      setEditing(null);
      setShowForm(false);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: user?.id,
        name: data.name,
        description: data.description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      setHabits((hs) => {
        const updated = [...hs, newHabit];
        saveHabits([
          ...getHabits().filter((h) => h.userId !== user.id),
          ...updated,
        ]);
        return updated;
      });
      setShowForm(false);
    }
  }

  function handleCancel() {
    setEditing(null);
    setShowForm(false);
  }

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen"
      style={{ padding: "2rem 1rem" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between sm:items-center mb-4 max-sm:flex-col max-sm:gap-2">
          <h2 className="text-2xl font-bold">Your Habits</h2>
          <div className="flex gap-2 items-center">
            <button
              className="btn-primary gap-1 inline-flex!"
              data-testid="create-habit-button"
              onClick={() => {
                setShowForm(true);
                setEditing(null);
              }}
            >
              <Plus /> Add Habit
            </button>
            <button
              className="btn-accent hover:bg-(--accent)/50!"
              data-testid="auth-logout-button"
              onClick={() => setShowLogoutConfirmation(true)}
            >
              Logout
            </button>
          </div>
        </div>
        {showForm && (
          <Modal
            open={showForm}
            onClose={handleCancel}
            ariaLabel={editing ? "Edit Habit" : "Add Habit"}
          >
            <HabitForm
              initial={editing ? habits.find((h) => h.id === editing) : {}}
              onSave={handleSaveHabit}
              onCancel={handleCancel}
            />
          </Modal>
        )}

        {deleteId && (
          <Modal
            open={!!deleteId}
            onClose={cancelDelete}
            ariaLabel="Delete Confirmation"
          >
            <div className="text-center p-4">
              <h3 className="text-lg font-bold mb-4 text-black">
                Delete this habit?
              </h3>
              <p className="mb-4">
                Are you sure you want to delete this habit?
                <br />
                This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  className="btn-primary"
                  data-testid="confirm-delete-button"
                  style={{ background: "lab(55.4814% 75.0732 48.8528)" }}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button className="btn-accent" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showLogoutConfirmation && (
          <Modal
            open={showLogoutConfirmation}
            onClose={() => setShowLogoutConfirmation(false)}
            ariaLabel="Logout Confirmation"
          >
            <div className="text-center p-4">
              <h3 className="text-lg font-bold mb-4 text-black">Logout?</h3>
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="btn-primary"
                  data-testid="confirm-logout-button"
                  style={{ background: "lab(55.4814% 75.0732 48.8528)" }}
                  onClick={logout}
                >
                  Logout
                </button>
                <button
                  className="btn-accent"
                  onClick={() => setShowLogoutConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        {habits.length === 0 ? (
          <div data-testid="empty-state">No habits yet.</div>
        ) : (
          <HabitList
            habits={habits}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            streaks={streaks}
            completedToday={completedToday}
          />
        )}
      </div>
    </div>
  );
}
