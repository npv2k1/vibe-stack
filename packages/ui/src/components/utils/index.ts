import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export * from './file';
export * from './object';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
