import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCredits(n: number): string {
  return `${n} ${n === 1 ? "credit" : "credits"}`
}
