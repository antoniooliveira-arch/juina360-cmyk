import { clsx } from 'clsx';
import { tailwindMerge } from '@/lib/tw';

export function cn(...inputs: (string | false | null | undefined)[]) {
  return tailwindMerge(clsx(inputs));
}