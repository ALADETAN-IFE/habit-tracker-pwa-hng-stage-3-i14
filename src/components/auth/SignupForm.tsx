"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveUsers, saveSession } from "@/lib/storage";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const users = getUsers();
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setError("User already exists");
      return;
    }
    const newUser = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id, email: newUser.email });
    router.replace("/dashboard");
  }

  return (
    <div className="centered px-2">
      <form
        className="card w-full max-w-md"
        style={{ background: "#fff" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>
        <label className="block mb-2">
          Email
          <input
            data-testid="auth-signup-email"
            className="w-full border rounded p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-2">
          Password
          <input
            data-testid="auth-signup-password"
            className="w-full border rounded p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          data-testid="auth-signup-submit"
          className="btn-primary w-full my-2"
          type="submit"
        >
          Sign up
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-(--primary) no-underline hover:underline"
            data-testid="link-to-login"
          >
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}