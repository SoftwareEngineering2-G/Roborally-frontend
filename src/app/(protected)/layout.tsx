"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Check authentication status
  if (typeof window !== "undefined") {
    // This ensures the code runs only on the client side
    const userId = localStorage.getItem("userId");
    if (!userId) {
      redirect("/signin");
    }
  }

  return <>{children}</>;
}
