"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    // Check if user has valid JWT token (not just username)
    if (!isAuthenticated()) {
      router.push("/signin");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-chrome-light">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
}
