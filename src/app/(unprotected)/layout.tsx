"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Check authentication status in useEffect to avoid hydration mismatch
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      redirect("/");
    }
  }, []);

  return <>{children}</>;
}
