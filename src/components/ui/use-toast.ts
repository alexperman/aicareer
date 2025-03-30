import { toast as sonner } from 'sonner';

export const toast = sonner;

export function useToast() {
  return {
    toast,
  };
}
