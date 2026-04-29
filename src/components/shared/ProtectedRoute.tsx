"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import { LoaderPinwheel } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LOADING_KEY } from "@/lib/constants";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const session = getSession();
  const user = getCurrentUser();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsCheckingAuth(localStorage.getItem(LOADING_KEY) === "true");
    if (!session || !user) {
        router.replace("/login");
        localStorage.setItem(LOADING_KEY, "true");
        setIsCheckingAuth(false);
      } else {
        localStorage.setItem(LOADING_KEY, "false");
        setIsCheckingAuth(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [session, router, user]);


  if (!isMounted) {
    return <div className="h-screen" />;
  }

  if (isCheckingAuth) {
    return (
      <div
        data-testid="checking-auth-screen"
        className="h-screen flex items-center justify-center text-2xl font-bold text-primary"
      >
        <LoaderPinwheel className="animate-spin" size={40} /> &nbsp;
        Authenticating... &nbsp;{" "}
        <LoaderPinwheel className="animate-spin" size={40} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
