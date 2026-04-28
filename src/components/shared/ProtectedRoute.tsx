"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import { LoaderPinwheel } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const session = getSession();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (!session) {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [session, router]);


  if (!isMounted) {
    return <div className="h-screen" />;
  }

  if (!session) {
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
