import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names, resolving Tailwind utility conflicts (later classes win).
 * Standard shadcn/ui helper: clsx handles conditionals, tailwind-merge dedupes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
