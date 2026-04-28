"use client";
import SignupForm from "@/components/auth/SignupForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession } from "@/lib/storage";

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (getSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <SignupForm />;
}