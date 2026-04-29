import { User, Session } from "@/types/auth";
import { Habit } from "@/types/habit";
import { USERS_KEY, SESSION_KEY, HABITS_KEY, LOADING_KEY } from "./constants";


export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.setItem(LOADING_KEY, "true");
}

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const habits = localStorage.getItem(HABITS_KEY);
  return habits ? JSON.parse(habits) : [];
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
