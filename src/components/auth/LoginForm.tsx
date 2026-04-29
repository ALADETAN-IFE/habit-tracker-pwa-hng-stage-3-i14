"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveSession } from "@/lib/storage";

export default function LoginForm() {
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
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );
    if (!user) {
      setError("Invalid email or password");
      return;
    }
    saveSession({ userId: user.id, email: user.email });
    router.replace("/dashboard");
  }

  return (
    <div className="centered px-4">
      <form
        className="card w-full max-w-md"
        style={{ background: "#fff" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <label className="block mb-2">
          Email
          <input
            data-testid="auth-login-email"
            className="w-full border rounded p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            data-testid="auth-login-password"
            className="w-full border rounded p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          data-testid="auth-login-submit"
          className="btn-primary w-full"
          type="submit"
        >
          Log in
        </button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-(--primary) no-underline hover:underline"
            data-testid="link-to-signup"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
