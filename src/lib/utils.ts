import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @author Sachin Baral 2025-09-15 08:43:34 +0200 4
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
