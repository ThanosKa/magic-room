import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/** "1 credit", "2 credits": the one place that decides singular or plural. */
export function formatCredits(n: number): string {
  return `${n} ${n === 1 ? "credit" : "credits"}`
}
