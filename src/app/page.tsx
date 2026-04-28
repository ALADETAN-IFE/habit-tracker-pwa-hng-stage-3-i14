"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [router]);

  return showSplash ? <SplashScreen /> : null;
}