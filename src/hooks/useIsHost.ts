"use client";

import { useSearchParams } from "next/navigation";

export const useIsHost = () => {
  const searchParams = useSearchParams();
  const hostuser = searchParams.get("hostuser");

  return hostuser === "true";
};
