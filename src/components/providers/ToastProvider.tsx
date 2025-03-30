import { Toaster } from 'sonner';
import { toast as sonner } from 'sonner';

export const toast = sonner;

export function useToast() {
  return {
    toast: (message: string, options?: { title?: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) => {
      return sonner(message, options);
    },
  };
}

export function ToastProvider() {
  return <Toaster />;
}
