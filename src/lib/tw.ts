import { twMerge } from 'tailwind-merge';

export function tailwindMerge(...inputs: string[]) {
  return twMerge(inputs);
}