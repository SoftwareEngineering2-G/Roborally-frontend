"use client";
import type React from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

/**
 * @author Sachin Baral 2025-09-16 21:38:48 +0200 6
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  // Check authentication status in useEffect to avoid hydration mismatch
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      redirect("/");
    }
  }, []);

  return <>{children}</>;
}