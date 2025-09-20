"use client";
import React from "react";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      redirect("/signin");
    }
  }, []);

  return <>{children}</>;
}
