"use client";

import { useSearchParams } from "next/navigation";

/**
 * @author Sachin Baral 2025-09-30 17:34:55 +0200 5
 */
export const useIsHost = () => {
  const searchParams = useSearchParams();
  const hostuser = searchParams.get("hostuser");

  return hostuser === "true";
};
