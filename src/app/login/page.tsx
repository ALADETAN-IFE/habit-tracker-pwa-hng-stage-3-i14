"use client";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession } from "@/lib/storage";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (getSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <LoginForm />;
}