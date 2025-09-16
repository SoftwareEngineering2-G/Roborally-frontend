"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      redirect("/signin");
    }
  }, []);

  return <>{children}</>;
}
