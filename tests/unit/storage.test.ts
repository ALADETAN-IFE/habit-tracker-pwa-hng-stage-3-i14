// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
  getHabits,
  saveHabits,
} from "../../src/lib/storage";
import {
  USERS_KEY,
  SESSION_KEY,
  HABITS_KEY,
  LOADING_KEY,
} from "../../src/lib/constants";
import type { User, Session } from "../../src/types/auth";
import type { Habit } from "../../src/types/habit";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getUsers returns empty array when no users stored", () => {
    expect(getUsers()).toEqual([]);
  });

  it("getUsers returns parsed users from localStorage", () => {
    const users: User[] = [
      { id: "u1", email: "a@a.com", password: "pw", createdAt: "2026-01-01" },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    expect(getUsers()).toEqual(users);
  });

  it("saveUsers persists users to localStorage", () => {
    const users: User[] = [
      { id: "u2", email: "b@b.com", password: "pw2", createdAt: "2026-01-02" },
    ];
    saveUsers(users);
    expect(JSON.parse(localStorage.getItem(USERS_KEY)!)).toEqual(users);
  });

  it("getSession returns null when no session stored", () => {
    expect(getSession()).toBeNull();
  });

  it("getSession returns parsed session from localStorage", () => {
    const session: Session = { userId: "u1", email: "a@a.com" };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    expect(getSession()).toEqual(session);
  });

  it("saveSession persists session to localStorage", () => {
    const session: Session = { userId: "u3", email: "c@c.com" };
    saveSession(session);
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual(session);
  });

  it("clearSession removes the session key from localStorage", () => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: "u1", email: "a@a.com" }),
    );
    clearSession();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("clearSession sets the loading key to true", () => {
    clearSession();
    expect(localStorage.getItem(LOADING_KEY)).toBe("true");
  });

  it("getHabits returns empty array when no habits stored", () => {
    expect(getHabits()).toEqual([]);
  });

  it("getHabits returns parsed habits from localStorage", () => {
    const habits: Habit[] = [
      {
        id: "h1",
        userId: "u1",
        name: "Drink Water",
        description: "",
        frequency: "daily",
        createdAt: "2026-01-01",
        completions: [],
      },
    ];
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    expect(getHabits()).toEqual(habits);
  });

  it("saveHabits persists habits to localStorage", () => {
    const habits: Habit[] = [
      {
        id: "h2",
        userId: "u2",
        name: "Read",
        description: "daily reading",
        frequency: "daily",
        createdAt: "2026-01-02",
        completions: ["2026-01-02"],
      },
    ];
    saveHabits(habits);
    expect(JSON.parse(localStorage.getItem(HABITS_KEY)!)).toEqual(habits);
  });
});
