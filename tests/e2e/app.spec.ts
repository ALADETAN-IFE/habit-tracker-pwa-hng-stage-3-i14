import { USERS_KEY } from "@/lib/constants";
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
console.log(`Using base URL: ${BASE}`);
const SESSION_KEY = "habit-tracker-session";

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {

    await page.goto(`${BASE}/`);
    await page.waitForSelector('[data-testid="splash-screen"]');
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.addInitScript(
      (session) => {
        localStorage.setItem("habit-tracker-session", session);
      },
      JSON.stringify({ userId: "u1", email: "auto@ex.com" }),
    );
    await page.addInitScript(
      (user) => {
        localStorage.setItem("habit-tracker-users", user);
      },
      JSON.stringify([
        { id: "u1", email: "auto@ex.com", password: "password"},
      ]),
    );
    await page.goto(`${BASE}/`);
    await page.waitForSelector('[data-testid="dashboard-page"]');
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.fill('[data-testid="auth-signup-email"]', "e2e1@example.com");
    await page.fill('[data-testid="auth-signup-password"]', "password");
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForSelector('[data-testid="dashboard-page"]');
    await page.evaluate(
      (key) => localStorage.getItem(key),
      USERS_KEY,
    );
    const session = await page.evaluate(
      (key) => localStorage.getItem(key),
      SESSION_KEY,
    );
    expect(session).not.toBeNull();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    const userA = { id: "ua", email: "a@ex.com", password: "a" };
    const habits = [
      {
        id: "h1",
        userId: "ua",
        name: "A Habit",
        description: "",
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      },
      {
        id: "h2",
        userId: "ub",
        name: "B Habit",
        description: "",
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ];
    await page.addInitScript(
      ([u, h]) => {
        localStorage.setItem("habit-tracker-users", JSON.stringify([u]));
        localStorage.setItem("habit-tracker-habits", JSON.stringify(h));
      },
      [userA, habits],
    );

    await page.goto(`${BASE}/login`);
    await page.fill('[data-testid="auth-login-email"]', userA.email);
    await page.fill('[data-testid="auth-login-password"]', userA.password);
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForSelector('[data-testid="dashboard-page"]');
    const a = await page.$('[data-testid="habit-card-a-habit"]');
    const b = await page.$('[data-testid="habit-card-b-habit"]');
    expect(a).not.toBeNull();
    expect(b).toBeNull();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "ucreate", email: "creator@ex.com" }),
      );
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([{ id: "ucreate", email: "creator@ex.com", password: "password" }]),
      );
      localStorage.setItem("habit-tracker-habits", JSON.stringify([]));
    });
    await page.goto(`${BASE}/dashboard`);
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "New Habit");
    await page.fill('[data-testid="habit-description-input"]', "desc");
    await page.click('[data-testid="habit-save-button"]');
    await page.waitForSelector('[data-testid="habit-card-new-habit"]');
    const created = await page.$('[data-testid="habit-card-new-habit"]');
    expect(created).not.toBeNull();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    const habit = {
      id: "hc1",
      userId: "ucomp",
      name: "Do Yoga",
      description: "",
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };
    await page.addInitScript((h) => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "ucomp", email: "comp@ex.com" }),
      );
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([{
          id: "ucomp",
          email: "comp@ex.com",
          password: "password",
        }]),
      );
      localStorage.setItem("habit-tracker-habits", JSON.stringify([h]));
    }, habit);
    await page.goto(`${BASE}/dashboard`);
    await page.click('[data-testid="habit-complete-do-yoga"]');
    const streak = await page.textContent(
      '[data-testid="habit-streak-do-yoga"]',
    );
    expect(streak && streak.trim().length > 0).toBeTruthy();
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "persist", email: "p@ex.com" }),
      );
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([{ id: "persist", email: "p@ex.com", password: "password" }]),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "hp",
            userId: "persist",
            name: "Persist",
            description: "",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    });
    await page.goto(`${BASE}/dashboard`);
    await page.waitForSelector('[data-testid="habit-card-persist"]');
    await page.reload();
    await page.waitForSelector('[data-testid="habit-card-persist"]');
    const exists = await page.$('[data-testid="habit-card-persist"]');
    expect(exists).not.toBeNull();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "out", email: "out@ex.com" }),
      );
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([{ id: "out", email: "out@ex.com", password: "password" }]),
      );
    });
    await page.goto(`${BASE}/dashboard`);
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForTimeout(300);
    expect(page.url()).toContain("/login");
    const session = await page.evaluate(
      (key) => localStorage.getItem(key),
      SESSION_KEY,
    );
    expect(session).toBeNull();
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('[data-testid="splash-screen"]');

    // Unregister all service workers and reload
    await page.evaluate(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      window.location.reload();
    });

    await page.waitForLoadState("networkidle");
    // Do a second reload to ensure the SW takes control
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Now wait for the SW to control the page
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 20000 });
    await context.setOffline(true);
    await page.goto(`${BASE}/`);
    const splash = await page.$('[data-testid="splash-screen"]');
    const login = await page.$('[data-testid="auth-login-email"]');
    expect(splash || login).toBeTruthy();
    await context.setOffline(false);
  });
});
