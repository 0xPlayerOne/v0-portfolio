<<<<<<< HEAD
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
=======
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
>>>>>>> origin/staging

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
